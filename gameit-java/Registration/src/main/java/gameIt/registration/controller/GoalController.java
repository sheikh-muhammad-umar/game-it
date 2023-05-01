package gameIt.registration.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import gameIt.registration.dao.CoinTransactionDao;
import gameIt.registration.dao.GameDao;
import gameIt.registration.dao.GoalByGuardianDao;
import gameIt.registration.dao.LevelDao;
import gameIt.registration.dao.SkillDao;
import gameIt.registration.dao.UserDao;
import gameIt.registration.models.CoinTransaction;
import gameIt.registration.models.Game;
import gameIt.registration.models.GoalByGuardian;
import gameIt.registration.models.Level;
import gameIt.registration.models.Skill;
import gameIt.registration.models.Student;
import gameIt.registration.models.UserEntity;
import gameIt.registration.request.GoalByGuardianRequest;
import gameIt.registration.response.GoalByGuardianResponse;
import gameIt.registration.response.MessageResponse;
import gameIt.registration.response.UserStudentResponse;
import io.swagger.annotations.Api;

@Api(value = "goal", description = "Rest API for Goal")
@RestController
@RequestMapping("/api/goal")
public class GoalController {

	@Autowired
	UserDao userDao;

	@Autowired
	GameDao gameDao;

	@Autowired
	SkillDao skillDao;

	@Autowired
	LevelDao levelDao;

	@Autowired
	GoalByGuardianDao goalByGuardianDao;

	@Autowired
	CoinTransactionDao coinTransactionDao;

	@PostMapping("/assignGoal")
	@ResponseStatus(HttpStatus.CREATED)

	public ResponseEntity<?> assignGoal(@RequestBody GoalByGuardianRequest goalByGuardianRequest, HttpSession session) {

		String usernameGuardian = (String) session.getAttribute("username");

		int guardianId = (int) userDao.getUserByUserName(usernameGuardian).getUserid();

		GoalByGuardian goalByGuardian = new GoalByGuardian();

		goalByGuardian.setAssignerID(guardianId);
		goalByGuardian.setAssigneeID(goalByGuardianRequest.getStudentID());
		goalByGuardian.setGameId(goalByGuardianRequest.getGameId());
		goalByGuardian.setSkillId(goalByGuardianRequest.getSkillId());
		goalByGuardian.setLevelId(goalByGuardianRequest.getLevelId());
		goalByGuardian.setTargetGoal(goalByGuardianRequest.getTargetGoal());
		goalByGuardian.setTimeFrame(goalByGuardianRequest.getTimeFrame());
		goalByGuardian.setStatus("inProgress");


		if ((Integer) goalByGuardianRequest.getCoins() != 0) {
			CoinTransaction coinTransaction = new CoinTransaction();

			coinTransaction.setAmountOfCoins(goalByGuardianRequest.getCoins());
			coinTransaction.setFromUserId(guardianId);
			coinTransaction.setToUserId(goalByGuardianRequest.getStudentID());
			coinTransaction.setStatus("inProgress");
			coinTransaction.setReason("Guardian_Reward");

			CoinTransaction newCoinTransaction = coinTransactionDao.addCoinTransaction(coinTransaction);

			UserEntity userEntity = userDao.getUserById(guardianId);
			int newCoin = userEntity.getCoin() - goalByGuardianRequest.getCoins();

			userDao.updateUserCoins(guardianId, newCoin);

			goalByGuardian.setCoinTransaction(newCoinTransaction);

		}

		goalByGuardianDao.addGoalByGuardian(goalByGuardian);

		return ResponseEntity.ok(new MessageResponse("Goal is assigned to Student successfully!"));
	}

	@PostMapping("/endGoal") // TimeFrame due or TargetGoal reached
	public ResponseEntity<?> endGoal(@RequestParam Integer goalId, @RequestParam Integer score) {

		GoalByGuardian goalByGuardian = goalByGuardianDao.getGoalByGuardianById(goalId);
		CoinTransaction coinTransaction = goalByGuardian.getCoinTransaction();

		if (goalByGuardian.getTargetGoal() <= score) {

			goalByGuardian.setStatus("suceeded");

			if (coinTransaction != null) {
				coinTransaction.setStatus("sucess");

				UserEntity userEntity = userDao.getUserById(coinTransaction.getToUserId());
				int newCoin = userEntity.getCoin() + coinTransaction.getAmountOfCoins();

				userDao.updateUserCoins(coinTransaction.getToUserId(), newCoin);

				CoinTransaction newCoinTransaction = coinTransactionDao.updateCoinTransaction(coinTransaction);

				goalByGuardian.setCoinTransaction(newCoinTransaction);

			}
			goalByGuardianDao.updateGoalByGuardian(goalByGuardian);

			return ResponseEntity.ok(new MessageResponse("Goal is ended successfully!"));

		} else {
			goalByGuardian.setStatus("failed");
			if (coinTransaction != null) {
				coinTransaction.setStatus("failure");

				UserEntity userEntity = userDao.getUserById(coinTransaction.getFromUserId());
				int newCoin = userEntity.getCoin() + coinTransaction.getAmountOfCoins();

				userDao.updateUserCoins(coinTransaction.getFromUserId(), newCoin);

				CoinTransaction newCoinTransaction = coinTransactionDao.updateCoinTransaction(coinTransaction);

				goalByGuardian.setCoinTransaction(newCoinTransaction);
			}
			goalByGuardianDao.updateGoalByGuardian(goalByGuardian);

			return ResponseEntity.ok(new MessageResponse("Goal is ended not succeeded!"));

		}
	}

	@GetMapping("displayGoalsByGuardian")
	public List<GoalByGuardianResponse> displayGoalsByGuardian(HttpSession session) {

		String usernameGuardian = (String) session.getAttribute("username");
		int id = (int) userDao.getUserByUserName(usernameGuardian).getUserid();

		List<GoalByGuardian> goalsByGuardian = goalByGuardianDao.getGoalsByGuardianByAssigner(id);

		List<GoalByGuardianResponse> GoalByGuardianResponses = new ArrayList<GoalByGuardianResponse>();

		for (GoalByGuardian goalByGuardian : goalsByGuardian) {

			int userId = goalByGuardian.getAssigneeID();
			UserEntity userEntity = userDao.getUserById(userId);

			Game game = gameDao.getGameById(goalByGuardian.getGameId());

			Skill skill = skillDao.getSkillById(goalByGuardian.getSkillId());

			Level level = levelDao.getLevelById(goalByGuardian.getLevelId());

			GoalByGuardianResponses.add(new GoalByGuardianResponse(userEntity.getFirstName(), userEntity.getLastName(),
					game.getImage(), skill.getSkillName(), level.getLevelName(), goalByGuardian.getTargetGoal(),
					goalByGuardian.getDateCreated(), goalByGuardian.getTimeFrame(), goalByGuardian.getStatus(),
					goalByGuardian.getCoinTransaction().getAmountOfCoins()));
		}

		return GoalByGuardianResponses;

	}

	@DeleteMapping("deleteGoalByGuardian")
	public ResponseEntity<?> deleteGoalByGuardian(@RequestParam Integer goalId, HttpSession session) {

		GoalByGuardian goalByGuardian = goalByGuardianDao.getGoalByGuardianById(goalId);

		if (goalByGuardian.getStatus().equals("inProgress")) {

			if (goalByGuardian.getCoinTransaction() != null) {

				String usernameGuardian = (String) session.getAttribute("username");
				int userId = (int) userDao.getUserByUserName(usernameGuardian).getUserid();

				UserEntity userEntity = userDao.getUserById(userId);
				int newCoin = userEntity.getCoin() + goalByGuardian.getCoinTransaction().getAmountOfCoins();

//			userDao.updateUserCoins(goal.getCoinTransaction().getFromUserId(), newCoin);
				userDao.updateUserCoins(userId, newCoin);
			}
			goalByGuardianDao.deleteGoalByGuardianById(goalId);

			return ResponseEntity.ok(new MessageResponse("Goal is deleted successfully!"));

		} else
			return ResponseEntity.ok(new MessageResponse("Goal is already ended!"));

	}
}
