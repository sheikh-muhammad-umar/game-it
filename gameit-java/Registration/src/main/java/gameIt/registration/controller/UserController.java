package gameIt.registration.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.ModelAndView;

import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;

import gameIt.registration.dao.GuardianDao;
import gameIt.registration.dao.StudentDao;
import gameIt.registration.dao.UserDao;
import gameIt.registration.exception.EmailAlreadyExistsException;
import gameIt.registration.exception.LinkActivatedException;
import gameIt.registration.exception.NullTokenException;
import gameIt.registration.exception.UsernameAlreadyExistsException;
import gameIt.registration.service.ConfirmationToken;
import gameIt.registration.service.ConfirmationTokenRepository;
import gameIt.registration.service.EmailService;
import gameIt.registration.service.MailJet;
import gameIt.registration.models.Student;
import gameIt.registration.models.UserEntity;
import gameIt.registration.response.MessageResponse;
import gameIt.registration.response.UserRegisterInfo;
import gameIt.registration.service.UserRepository;
import io.swagger.annotations.Api;

@Api(value = "user", description = "Rest API for User registration")
@RestController
@RequestMapping("/api/auth")
public class UserController {

	@Autowired
	private Environment env;
	
	@Autowired
	UserDao userDao;

	@Autowired
	GuardianDao guardianDao;

	@Autowired
	StudentDao studentDao;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ConfirmationTokenRepository confirmationTokenRepository;

	@Autowired
	private EmailService emailService;

	// default of reActivate is "NO"
	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> registerUser(@RequestBody UserRegisterInfo userRegisterInfo, HttpServletRequest request,
			@RequestParam(value = "reActivate", required = false, defaultValue = "NO") String reActivate)
			throws MailjetException, MailjetSocketTimeoutException, EmailAlreadyExistsException,
			UsernameAlreadyExistsException {

		System.out.println(request.getSession().getId());
		String appURI = env.getProperty("gameit.app.URI");
		
		UserEntity existingUserEmail = userRepository.findByEmailIdIgnoreCase(userRegisterInfo.getEmailId());

		UserEntity existingUserName = userRepository.findByUsername(userRegisterInfo.getUsername());

		if (existingUserEmail != null && reActivate.equals("NO")) {
			if (existingUserEmail.getDeleted() == null || existingUserEmail.getDeleted() == false) {
				throw new EmailAlreadyExistsException("This Email already exists!");
			} else {
				return ResponseEntity.ok(new MessageResponse("email-deleted")); // recall the API with reActivate="YES"
			}
		} else if (existingUserEmail != null) {

			existingUserEmail.setDeleted(false);
			existingUserEmail.setEnabled(false);
			userDao.updateUser(existingUserEmail);

			List<Student> students =studentDao.getStudentsForGuardian((int) existingUserEmail.getUserid());
						
			for (Student student : students) {
				student.getUserEntity().setDeleted(false);
				student.getUserEntity().setEnabled(false);
				userDao.updateUser(student.getUserEntity());
			}

			ConfirmationToken confirmationToken = new ConfirmationToken(existingUserEmail);
			confirmationToken.setUserEntity(existingUserEmail);

			confirmationTokenRepository.save(confirmationToken);

			MailJet mailJet = new MailJet();
			mailJet.sendMail(existingUserEmail.getEmailId(), existingUserEmail.getFirstName(),
					appURI + "verify?token=" + confirmationToken.getConfirmationToken());

			return ResponseEntity.ok(new MessageResponse("User reActivated successfully!"));

		} else if (existingUserName != null) {
			throw new UsernameAlreadyExistsException("This Username already exists!");

		} else {

			UserEntity userEntity = new UserEntity();


			userEntity.setFirstName(userRegisterInfo.getFirstName());
			userEntity.setLastName(userRegisterInfo.getLastName());
			userEntity.setUserName(userRegisterInfo.getUsername());
			userEntity.setEmailId(userRegisterInfo.getEmailId());
			String encodedPassword = bCryptPasswordEncoder.encode(userRegisterInfo.getPassword());
			userEntity.setPassword(encodedPassword);

			userEntity.setUserType("guardian");
			userEntity.setEnabled(false);

//    			userRepository.save(userEntity);
			userDao.addUserGuardian(userEntity);

			ConfirmationToken confirmationToken = new ConfirmationToken(userEntity);
			confirmationToken.setUserEntity(userEntity);

			confirmationTokenRepository.save(confirmationToken);

			MailJet mailJet = new MailJet();
			mailJet.sendMail(userEntity.getEmailId(), userEntity.getFirstName(),
					appURI + "verify?token=" + confirmationToken.getConfirmationToken());


		}

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
		// return ResponseEntity.ok(userEntity);
	}


	@GetMapping("/confirm-account")
	@ResponseBody
	public ResponseEntity<?> confirmUserAccount(@RequestParam("token") String confirmationToken)
			throws NullTokenException, LinkActivatedException {
		ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);

		if (token != null) {
			UserEntity userEntity = userRepository.findByEmailIdIgnoreCase(token.getUserEntity().getEmailId());
			if (userEntity.isEnabled()) {
				throw new LinkActivatedException("The link is already activated!");
			}
			userEntity.setEnabled(true);

			userRepository.save(userEntity);
			
			List<Student> students =studentDao.getStudentsForGuardian((int) userEntity.getUserid());
			
			for (Student student : students) {
				student.getUserEntity().setEnabled(true);
				userDao.updateUser(student.getUserEntity());
			}
			
			
			int id = (int) userEntity.getUserid();

//			remove record from confirm token table
			userDao.deleteConfirmRegisterToken(id);

			if (userEntity.getDeleted() == null)
				guardianDao.addGuardianId(id);
			return ResponseEntity.ok(new MessageResponse("success"));
		} else {
			throw new NullTokenException("The link is invalid or broken!");
		}
	}

}
