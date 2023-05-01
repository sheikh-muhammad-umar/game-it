package gameIt.registration.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gameIt.registration.response.MessageResponse;
import gameIt.registration.response.UserInfoResponse;
import gameIt.registration.service.CustomUserDetails;
import gameIt.registration.service.LoginRequest;
import gameIt.registration.service.UserRepository;
import io.swagger.annotations.Api;

@Api(value = "signin", description = "Rest API for User Signin")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpSession session) {

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    session.setAttribute("username", loginRequest.getUsername());
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    
    if( userDetails.getUser().getDeleted() == null || userDetails.getUser().getDeleted() == false)
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, "")
		       .body(new UserInfoResponse(userDetails.getUserId(),
		            userDetails.getUsername(),
		            userDetails.getUser().getFirstName(),
		            userDetails.getUser().getLastName(),
		            userDetails.getEmailId(),
		            userDetails.getUser().getUserType()));

    else
    	 return ResponseEntity.badRequest().body(new MessageResponse("unAuthorized"));
  }

  
}
