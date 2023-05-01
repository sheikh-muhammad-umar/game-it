package gameIt.registration.controller;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;

import gameIt.registration.dao.UserDao;
import gameIt.registration.exception.LinkActivatedException;
import gameIt.registration.exception.NullTokenException;
import gameIt.registration.models.UserEntity;
import gameIt.registration.request.LaunchRequest;
import gameIt.registration.request.ResetPasswordRequest;
import gameIt.registration.service.EmailService;
import gameIt.registration.service.MailJet;
import gameIt.registration.service.UserRepository;
import gameIt.registration.service.Utility;
import io.swagger.annotations.Api;
import net.bytebuddy.utility.RandomString;

@Api(value = "user", description = "Rest API for User forgot password")
@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

	@Autowired
	private Environment env;

	@Autowired
	private UserDao userDao;

	@Autowired
	private UserRepository userRepo;

	@GetMapping("/forgot_password")
	public String showForgotPasswordForm() {
		return "forgot_password";
	}
	

	@PostMapping("/forgot_password")
	public ResponseEntity<String> processForgotPassword(@RequestParam String email)
			throws MailjetException, MailjetSocketTimeoutException, EntityNotFoundException {

		String token = RandomString.make(30);
		String appURI = env.getProperty("gameit.app.URI");
		
		UserEntity userEntity = userRepo.findByEmailIdIgnoreCase(email);
		if (userEntity != null) {
			userEntity.setResetPasswordToken(token);
			userRepo.save(userEntity);
		} else {
			throw new EntityNotFoundException("Could not find any user with the email " + email);
		}

		userDao.updateResetPasswordToken(token, email);

		MailJet mailJet = new MailJet();
		mailJet.sendForgotPasswordMail(email, appURI + "reset-password?token=" + token);

		return ResponseEntity.status(HttpStatus.OK)
				.body("We have sent a reset password link to your email. Please check.");

	}


	@GetMapping("/reset_password")
	public void showResetPasswordForm(@RequestParam("token") String token)
			throws NullTokenException, LinkActivatedException {
		UserEntity userEntity = userDao.getByResetPasswordToken(token);

		if (userEntity == null) {
			throw new NullTokenException("The link is invalid or broken!");

		}
	}



	@PostMapping("/reset_password")
	public ResponseEntity<String> processResetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) throws NullTokenException, LinkActivatedException , NullPointerException {

			UserEntity userEntity = userDao.getByResetPasswordToken(resetPasswordRequest.getToken());
            if (userEntity == null) {
    			throw new NullTokenException("The link is invalid or broken!");
			}
			
            else {
            	userDao.updatePassword(userEntity, resetPasswordRequest.getPassword());

			    return ResponseEntity.status(HttpStatus.OK).body("You have successfully changed your password.");
            }

	}
}