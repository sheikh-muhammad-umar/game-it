package gameIt.registration.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import io.swagger.annotations.Api;

@Api(value = "user", description = "Rest API for User login")
@Controller
public class LoginController {

	 @GetMapping("/login")
	    public String viewLoginPage() {
	        // custom logic before showing login page...	         
	        return "login";
	    }
	
}
