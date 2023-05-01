package gameIt.registration.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RequestCallback;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;

import gameIt.registration.models.Game;
import gameIt.registration.dao.GameDao;
import gameIt.registration.dao.GameSessionDao;
import gameIt.registration.dao.GuardianDao;
import gameIt.registration.dao.StudentDao;
import gameIt.registration.dao.StudentGameDao;
import gameIt.registration.dao.UserDao;
import gameIt.registration.exception.UsernameAlreadyExistsException;
import gameIt.registration.models.Student;
import gameIt.registration.models.StudentGame;
import gameIt.registration.models.User;
import gameIt.registration.models.UserEntity;
import gameIt.registration.response.GameSessionResponse;
import gameIt.registration.response.MessageResponse;
import gameIt.registration.response.StudentEditResponse;
import gameIt.registration.response.StudentGameResponse;
import gameIt.registration.response.StudentInfoResponse;
import gameIt.registration.response.UserInfoResponse;
import gameIt.registration.response.UserStudentResponse;
import gameIt.registration.service.FileUploadUtil;
import gameIt.registration.service.UserRepository;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
import io.swagger.annotations.Api;

@Api(value = "student", description = "Rest API for Student")
@RestController
@RequestMapping("/api/student")
public class StudentController {

	@Autowired
	private Environment env;

	@Autowired
	UserDao userDao;

	@Autowired
	GuardianDao guardianDao;

	@Autowired
	StudentDao studentDao;

	@Autowired
	GameDao gameDao;

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	StudentGameDao studentGameDao;

	@Autowired
	GameSessionDao gameSessionDao;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private RestTemplate restTemplate;

	@PostMapping("/students")
	@ResponseStatus(HttpStatus.CREATED)

	public ResponseEntity<?> addStudent(@RequestBody StudentInfoResponse studentInfoResponse, HttpSession session)
			throws UsernameAlreadyExistsException {

		String usernameGuardian = (String) session.getAttribute("username");

		int guardianId = (int) userDao.getUserByUserName(usernameGuardian).getUserid();

		UserEntity existingUserName = userDao.getUserByUserName(studentInfoResponse.getUsername());

		if (existingUserName != null) {
			throw new UsernameAlreadyExistsException("This Username already exists!");
		}

		String encodedPassword = bCryptPasswordEncoder.encode(studentInfoResponse.getPassword());
		studentInfoResponse.setPassword(encodedPassword);

		Student student = new Student();
		UserEntity userEntity = new UserEntity();

		userEntity.setFirstName(studentInfoResponse.getFirstName());
		userEntity.setLastName(studentInfoResponse.getLastName());
		userEntity.setUserName(studentInfoResponse.getUsername());
		userEntity.setPassword(studentInfoResponse.getPassword());
		userEntity.setUserType("student");
		
		student.setUserEntity(userEntity);

		student.setBirthdate(studentInfoResponse.getBirthdate());
		student.setSchool(studentInfoResponse.getSchool());
		student.setDiagnoses(studentInfoResponse.getDiagnoses());
		student.setCity(studentInfoResponse.getCity());

		userDao.addUser(student.getUserEntity());
		studentDao.addStudent(student, guardianId);

		//enable user
		userEntity.setEnabled(true);
		userRepository.save(userEntity);
		
		return ResponseEntity.ok(new UserInfoResponse(userEntity.getUserid() ,userEntity.getUserName(),userEntity.getFirstName(), userEntity.getLastName(), userEntity.getEmailId(),userEntity.getUserType()));

	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	@GetMapping("students")
//		public List<Student> displayStudents(@RequestParam String usernameGuardian) {
	public List<UserStudentResponse> displayStudents(HttpSession session) {

		String usernameGuardian = (String) session.getAttribute("username");
//			String name = principal.getName(); // get logged in username
		int id = (int) userDao.getUserByUserName(usernameGuardian).getUserid();
		List<Student> students = studentDao.getStudentsForGuardian(id);

		for (Student student : students) {
			student.setUserEntity(userDao.getUserForStudent(student.getId()));
		}

		List<UserStudentResponse> userStudentResponses = new ArrayList<UserStudentResponse>();

		for (Student student : students) {
			userStudentResponses.add(new UserStudentResponse(student.getId(), student.getUserEntity().getFirstName(),
					student.getUserEntity().getLastName()));
		}

//	        return students;
		return userStudentResponses;

	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	@DeleteMapping("deleteStudent")
	public ResponseEntity<?> deleteStudent(@RequestParam Integer studentId, HttpSession session) {

		String usernameGuardian = (String) session.getAttribute("username");
		int id = (int) userDao.getUserByUserName(usernameGuardian).getUserid();

		List<Student> students = studentDao.getStudentsForGuardian(id);

		List<Integer> iDs = students.stream().map((s) -> s.getId()).collect(Collectors.toList());

		if (iDs.contains(studentId)) {
			studentDao.deleteStudentById(studentId);
			return ResponseEntity.ok(new MessageResponse("Student is deleted successfully!"));
		} else
			return ResponseEntity.ok(new MessageResponse("You are not allowed to delete this student!"));

	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	@GetMapping("editStudent")
	public ResponseEntity<?> editStudent(@RequestParam Integer studentId, HttpSession session) {

		String usernameGuardian = (String) session.getAttribute("username");
		int id = (int) userDao.getUserByUserName(usernameGuardian).getUserid();

		List<Student> students = studentDao.getStudentsForGuardian(id);

		List<Integer> iDs = students.stream().map((s) -> s.getId()).collect(Collectors.toList());

		if (iDs.contains(studentId)) {
			Student student = studentDao.getStudentById(studentId);
			student.setUserEntity(userDao.getUserForStudent(student.getId()));

			return ResponseEntity.ok(new StudentEditResponse(student.getUserEntity().getFirstName(),
					student.getUserEntity().getLastName(), student.getUserEntity().getUserName(),
					student.getBirthdate(), student.getSchool(), student.getDiagnoses(), student.getCountry(),
					student.getCity()));

		} else
			return ResponseEntity.ok(new MessageResponse("You are not allowed to edit this student!"));

	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	@PutMapping("editStudent")
	public ResponseEntity<?> performEditStudent(@RequestBody StudentEditResponse studentEditResponse,
			@RequestParam Integer studentId, HttpSession session) throws ParseException {

		String usernameGuardian = (String) session.getAttribute("username");
		int id = (int) userDao.getUserByUserName(usernameGuardian).getUserid();

		List<Student> students = studentDao.getStudentsForGuardian(id);
		List<Integer> iDs = students.stream().map((s) -> s.getId()).collect(Collectors.toList());

		if (iDs.contains(studentId)) {
			Student student = studentDao.getStudentById(studentId);

//			try {
//
//				Date date = new SimpleDateFormat("yyyy/MM/dd").parse(map.get("birthdate"));
//
//				student.setBirthdate(date);
//
//			} catch (ParseException e) {
//
//				SimpleDateFormat in = new SimpleDateFormat("yyyy-MM-dd");
//				String parameter = map.get("birthdate");
//				Date date = in.parse(parameter);
//				student.setBirthdate(date);
//
//			}

			student.setBirthdate(studentEditResponse.getBirthdate());
			student.setCity(studentEditResponse.getCity());
			student.setCountry(studentEditResponse.getCountry());
			student.setSchool(studentEditResponse.getSchool());
			student.setDiagnoses(studentEditResponse.getDiagnoses());
			UserEntity userEntity = userDao.getUserForStudent(student.getId());
			userEntity.setFirstName(studentEditResponse.getFirstName());
			userEntity.setLastName(studentEditResponse.getLastName());
			userEntity.setUserName(studentEditResponse.getUsername());

			student.setUserEntity(userEntity);

			studentDao.updateStudent(student, studentId);
			userDao.updateUser(userEntity);

			return ResponseEntity.ok("Student is updated successfully!");
		} else
			return ResponseEntity.ok(new MessageResponse("You are not allowed to edit this student!"));

	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	@GetMapping("studentDetail")

	public ResponseEntity<?> studentDetail(@RequestParam Integer studentId, HttpSession session) {

		String usernameGuardian = (String) session.getAttribute("username");
		int id = (int) userDao.getUserByUserName(usernameGuardian).getUserid();

		List<Student> students = studentDao.getStudentsForGuardian(id);
		

		List<Integer> iDs = students.stream().map((s) -> s.getId()).collect(Collectors.toList());

		if (iDs.contains(studentId)) {
			Student student = studentDao.getStudentById(studentId);
			
			UserEntity userEntiity = userDao.getUserForStudent(studentId);
			student.setUserEntity(userEntiity);

			return ResponseEntity
					.ok(new StudentInfoResponse(student.getUserEntity().getFirstName(), student.getUserEntity().getLastName(),
							student.getUserEntity().getUserName(), student.getUserEntity().getPassword(), student.getBirthdate(),
							student.getSchool(), student.getDiagnoses(), student.getCountry(), student.getCity()));

		} else
			return ResponseEntity.ok(new MessageResponse("You are not allowed to view details of this student!"));

	}

	@GetMapping("addGame")
	public ResponseEntity<?> addGame(@RequestParam("studentId") Integer studentId,
			@RequestParam("gameId") Integer gameId, @RequestParam("instructions") String instructions) throws IOException {

		Game game = gameDao.getGameById(gameId);
		Student student = studentDao.getStudentById(studentId);
		StudentGame studentGame = new StudentGame(student, game);
		studentGame.setInstructions(instructions);

		studentGameDao.addStudentGame(studentGame);

		return ResponseEntity.ok(new MessageResponse("Game added to student succesfully!"));

	}
//displayAllGames & displayGamesForStudent add language parameter to both
	@GetMapping("studentGames")
	public List<StudentGameResponse> displayStudentGames(@RequestParam Integer StudentID, 
			@RequestParam(value = "language", required = false, defaultValue = "en") String language) {

		List<StudentGameResponse> games = gameDao.getGamesForStudent(StudentID, language);

		return games;
	}

	
	@GetMapping("games")
	public List<Game> displayAllGames(@RequestParam(value = "language", required = false, defaultValue = "en") String language) {

		List<Game> games = gameDao.getAllGames(language);

		return games;
	}

	
	@GetMapping("download")
	public ResponseEntity<Resource> download(@RequestParam("downloadGame") String downloadGame,
			@RequestParam("studentGameId") Integer studentGameId) throws IOException {

		String EXTENSION = env.getProperty("gameit.app.download.extension");
		String SERVER_LOCATION = env.getProperty("gameit.app.download.location");

		StudentGame studentGame = studentGameDao.getStudentGameById(studentGameId);
		String token = studentGame.getInstallationToken();

		File file = new File(SERVER_LOCATION + File.separator + downloadGame);

		HttpHeaders header = new HttpHeaders();
		header.add(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename =" + file.getName().replace(".", "{" + token + "}.")); // name assigned to saved file
		
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");

		 InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

		return ResponseEntity.ok().headers(header).contentLength(file.length())
				.contentType(MediaType.parseMediaType("application/octet-stream")).body(resource);
	}

	
	@GetMapping("gameSession")
	public List<GameSessionResponse> gameSessionData(@RequestParam Integer StudentID,
			@RequestParam(required = false) Integer GameID) {
		List<GameSessionResponse> studentGameResponses;
		if (GameID != null) {
			studentGameResponses = gameSessionDao.getGameSessionData(StudentID, GameID);
		} else {
			studentGameResponses = gameSessionDao.getGameSessionData(StudentID);
		}
		return studentGameResponses;
	}

	@GetMapping("studentsForGuardianGame")
public List<UserStudentResponse> displayStudentsForGuardianAndGame(HttpSession session, @RequestParam Integer gameId) {

	String usernameGuardian = (String) session.getAttribute("username");

	int guardianId = (int) userDao.getUserByUserName(usernameGuardian).getUserid();
	List<Student> students = studentGameDao.getAllStudentsForGuardianAndGame(guardianId, gameId);

	for (Student student : students) {
		student.setUserEntity(userDao.getUserForStudent(student.getId()));
	}

	List<UserStudentResponse> userStudentResponses = new ArrayList<UserStudentResponse>();

	for (Student student : students) {
		userStudentResponses.add(new UserStudentResponse(student.getId(), student.getUserEntity().getFirstName(),
				student.getUserEntity().getLastName()));
	}

	return userStudentResponses;
	
	}	
}
