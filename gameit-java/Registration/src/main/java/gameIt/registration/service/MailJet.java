package gameIt.registration.service;

import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.ClientOptions;
import com.mailjet.client.resource.Emailv31;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

public class MailJet {
	
	private String confirmationLink;
	final String mailjetApiKey = "266655bcdfca162063dd4efeada6159a";
	final String mailjetSecretKey = "7cb0d140277447ba2e5e508e593cdcfa";
	

	public void sendMail (String toEmail, String toFirstName, String confirmationLink) throws MailjetException, MailjetSocketTimeoutException {  
		System.out.println(confirmationLink);
		MailjetClient client;
	    MailjetRequest request;
	    MailjetResponse response;
	    client = new MailjetClient(mailjetApiKey, mailjetSecretKey, new ClientOptions("v3.1"));
	    request = new MailjetRequest(Emailv31.resource)
	  		  .property(Emailv31.MESSAGES, new JSONArray()
	        .put(new JSONObject()
	          .put(Emailv31.Message.FROM, new JSONObject()
	            .put("Email", "noreply@gameit.ai")
	            .put("Name", "GameIT"))
	          .put(Emailv31.Message.TO, new JSONArray()
	            .put(new JSONObject()
	              .put("Email", toEmail)
	              .put("Name", toFirstName )))
	          .put(Emailv31.Message.TEMPLATEID, 3466573)
	          .put(Emailv31.Message.TEMPLATELANGUAGE, true)
	          .put(Emailv31.Message.SUBJECT, "Welcome to GameIT")
	          .put(Emailv31.Message.VARIABLES, new JSONObject()
	          .put("firstname", toFirstName)
	          .put("confirmation_link", confirmationLink ))));
	    
	      response = client.post(request);
	      System.out.println(response.getStatus());
	      System.out.println(response.getData());
      }
	
	public void sendForgotPasswordMail (String toEmail, String confirmationLink) throws MailjetException, MailjetSocketTimeoutException {  
		System.out.println(confirmationLink);
		MailjetClient client;
	    MailjetRequest request;
	    MailjetResponse response;
	    client = new MailjetClient(mailjetApiKey, mailjetSecretKey, new ClientOptions("v3.1"));
	    request = new MailjetRequest(Emailv31.resource)
	  		  .property(Emailv31.MESSAGES, new JSONArray()
	        .put(new JSONObject()
	          .put(Emailv31.Message.FROM, new JSONObject()
	            .put("Email", "noreply@gameit.ai")
	            .put("Name", "GameIT"))
	          .put(Emailv31.Message.TO, new JSONArray()
	            .put(new JSONObject()
	              .put("Email", toEmail)))
	          .put(Emailv31.Message.TEMPLATEID, 3498825)
	          .put(Emailv31.Message.TEMPLATELANGUAGE, true)
	          .put(Emailv31.Message.SUBJECT, "Password Reset")
	          .put(Emailv31.Message.VARIABLES, new JSONObject()
	          .put("confirmation_link", confirmationLink ))));
	    
	      response = client.post(request);
	      System.out.println(response.getStatus());
	      System.out.println(response.getData());
      }
}