package gameIt.registration.controller;

import java.util.Date;
import java.util.List;

import org.springframework.core.env.Environment;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
//import java.sql.Blob;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import gameIt.registration.dao.GameDao;
import gameIt.registration.dao.GameSessionDao;
import gameIt.registration.dao.StudentDao;
import gameIt.registration.dao.StudentGameDao;
import gameIt.registration.models.Game;
import gameIt.registration.models.GameSession;
import gameIt.registration.models.Student;
import gameIt.registration.models.StudentGame;
import gameIt.registration.request.ActivateRequest;
import gameIt.registration.request.LaunchRequest;
import gameIt.registration.response.LaunchResponse;
import gameIt.registration.response.MessageResponse;
import gameIt.registration.response.StudentGameResponse;
import gameIt.registration.response.StudentInfoResponse;
import gameIt.registration.response.UserInfoResponse;
import io.swagger.annotations.Api;

@Api(value = "game", description = "Rest API for Game")
@RestController
@RequestMapping("/api/game")
public class GameController {

	@Autowired
	private Environment env;

	@Autowired
	GameDao gameDao;

	@Autowired
	StudentDao studentDao;

	@Autowired
	StudentGameDao studentGameDao;

	@Autowired
	GameSessionDao gameSessionDao;

	@GetMapping("download")
	public ResponseEntity<Resource> download(@RequestParam String token) throws IOException {

		String SERVER_LOCATION = env.getProperty("gameit.app.download.location");

		Game game = studentGameDao.getGameByToken(token);
		
		File file = new File(SERVER_LOCATION + File.separator + game.getImage());

		HttpHeaders header = new HttpHeaders();
		header.add(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename =" + file.getName()); 
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");

		InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

		return ResponseEntity.ok().headers(header).contentLength(file.length())
				.contentType(MediaType.parseMediaType("application/octet-stream")).body(resource);
	}

	@PostMapping("activate")
	public ResponseEntity<?> activate(@RequestBody ActivateRequest activateRequest) {

		String gameSessionKey = studentGameDao.getGameSessionKeyByToken(activateRequest.getUser_key());

		return ResponseEntity.ok(new MessageResponse(gameSessionKey));
		// ResponseEntity.ok(JSONObject.quote(gameSessionKey));

	}

	@PostMapping("launch")
	public LaunchResponse launch(@RequestHeader("GameSessionKey") String GameSessionKey,
			@RequestBody LaunchRequest launchRequest) {

		JSONObject jo = new JSONObject(launchRequest);

		Game game = studentGameDao.getGameByGameSessionKey(GameSessionKey);
		Student student = studentGameDao.getStudentByGameSessionKey(GameSessionKey);

		GameSession gamesession = new GameSession(student, game);
		gamesession.setSessionData(jo.toString());
		gamesession.setSessionType("launch");
		gameSessionDao.addGameSession(gamesession);

		String downloadURI = env.getProperty("gameit.app.download.URI");
		String filename = env.getProperty("gameit.test.download.dummyFile");

		StudentGame studentGame = studentGameDao.getStudentGameByGameSessionKey(GameSessionKey);
		String download = downloadURI + "api/game/download?downloadGame=" + filename;

		LaunchResponse launchResponse = new LaunchResponse();

		if (launchRequest.getVersion() < game.getVersion()) {

			launchResponse.setMessage("need-update");
			launchResponse.setDownload(download);

			return launchResponse;
		} else {
			launchResponse.setMessage("up-to-date");

			return launchResponse;
		}
	}

	
	@PostMapping("start")
	public ResponseEntity<?> start(@RequestHeader("GameSessionKey") String GameSessionKey,
			@RequestBody String sessionData) {

		Game game = studentGameDao.getGameByGameSessionKey(GameSessionKey);
		Student student = studentGameDao.getStudentByGameSessionKey(GameSessionKey);

		GameSession gamesession = new GameSession(student, game);
		gamesession.setSessionData(sessionData);
		gamesession.setSessionType("start");
		gameSessionDao.addGameSession(gamesession);

		return ResponseEntity.ok(new MessageResponse("data-saved"));

	}
	
	@PostMapping("progress")
	public ResponseEntity<?> progress(@RequestHeader("GameSessionKey") String GameSessionKey,
			@RequestBody String sessionData) {

		Game game = studentGameDao.getGameByGameSessionKey(GameSessionKey);
		Student student = studentGameDao.getStudentByGameSessionKey(GameSessionKey);

		GameSession gamesession = new GameSession(student, game);
		gamesession.setSessionData(sessionData);
		gamesession.setSessionType("progress");
		gameSessionDao.addGameSession(gamesession);

		return ResponseEntity.ok(new MessageResponse("data-saved"));
	}

	@PostMapping("milestone")
	public ResponseEntity<?> milestone(@RequestHeader("GameSessionKey") String GameSessionKey,
			@RequestBody String sessionData) {

		Game game = studentGameDao.getGameByGameSessionKey(GameSessionKey);
		Student student = studentGameDao.getStudentByGameSessionKey(GameSessionKey);

		GameSession gamesession = new GameSession(student, game);
		gamesession.setSessionData(sessionData);
		gamesession.setSessionType("milestone");
		gameSessionDao.addGameSession(gamesession);

		return ResponseEntity.ok(new MessageResponse("data-saved"));

	}

}
