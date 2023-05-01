package gameIt.registration.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import gameIt.registration.dao.CoinTransactionDao;
import gameIt.registration.dao.GoalByGuardianDao;
import gameIt.registration.dao.GuardianDao;
import gameIt.registration.dao.UserDao;
import gameIt.registration.models.CoinTransaction;
import gameIt.registration.models.GoalByGuardian;
import gameIt.registration.models.Guardian;
import gameIt.registration.models.UserEntity;
import gameIt.registration.request.GoalByGuardianRequest;
import gameIt.registration.response.GuardianInfoResponse;
import gameIt.registration.response.MessageResponse;
import io.swagger.annotations.Api;

@Api(value = "guardian", description = "Rest API for Guardian")
@RestController
@RequestMapping("/api/auth")
public class GuardianController {

	@Autowired
	UserDao userDao;

	@Autowired
	GuardianDao guardianDao;

	@Autowired
	GoalByGuardianDao goalDao;

	@Autowired
	CoinTransactionDao coinTransactionDao;

	@GetMapping("editGuardian")
//	public Student editGuardian(@PathVariable("UserName") int username) {
	public ResponseEntity<?> editGuardian(HttpSession session) {
		String usernameGuardian = (String) session.getAttribute("username");
		UserEntity userEntity = userDao.getUserByUserName(usernameGuardian);
		int id = (int) userEntity.getUserid();
		Guardian guardian = guardianDao.getGuardianById(id);

//		return user;
		return ResponseEntity.ok(new GuardianInfoResponse(userEntity.getUserName(), userEntity.getFirstName(),
				userEntity.getLastName(), guardian.getPhoneNo(), guardian.getPaymentInfo()));
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////

	@PutMapping("editGuardian")
	public ResponseEntity<?> performEditGuardian(@RequestBody GuardianInfoResponse guardianInfoResponse,
			HttpSession session) {

		String usernameGuardian = (String) session.getAttribute("username");
		UserEntity userEntity = userDao.getUserByUserName(usernameGuardian);
		int id = (int) userEntity.getUserid();
		Guardian guardian = guardianDao.getGuardianById(id);

		userEntity.setUserName(guardianInfoResponse.getUsername());
		userEntity.setFirstName(guardianInfoResponse.getFirstName());
		userEntity.setLastName(guardianInfoResponse.getLastName());

		guardian.setPhoneNo(guardianInfoResponse.getPhoneNo());
		guardian.setPaymentInfo(guardianInfoResponse.getPaymentInfo());

		userDao.updateUser(userEntity);

		guardianDao.updateGuardian(guardian);

		return ResponseEntity.ok("Guardian is updated successfully!");
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	@DeleteMapping("deleteGuardian")
	public ResponseEntity<?> deleteGuardian(HttpSession session) {

		String usernameGuardian = (String) session.getAttribute("username");
		int id = (int) userDao.getUserByUserName(usernameGuardian).getUserid();
		guardianDao.deleteGuardianById(id);
		return ResponseEntity.ok(new MessageResponse("Guardian is deleted successfully!"));
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
