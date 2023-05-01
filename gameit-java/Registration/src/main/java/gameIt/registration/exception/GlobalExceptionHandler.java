package gameIt.registration.exception;

import javax.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;

@ControllerAdvice
public class GlobalExceptionHandler{
     
     @ExceptionHandler(value = EmailAlreadyExistsException.class)
     public ResponseEntity<Error> handleEmailAlreadyExistsException(EmailAlreadyExistsException e)
     {
           Error error = new Error();
           error.setMessage("EmailAlreadyExistsException: " + e.getMessage());
           HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
           return new ResponseEntity<Error>(error, status);
     }
   
     @ExceptionHandler(value = UsernameAlreadyExistsException.class)
     public ResponseEntity<Error> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException e)
     {
           Error error = new Error();
           error.setMessage("UsernameAlreadyExistsException: " + e.getMessage());
           HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
           return new ResponseEntity<Error>(error, status);
     }

     @ExceptionHandler(value = NullTokenException.class)
     public ResponseEntity<Error> handleNullTokenException(NullTokenException e)
     {
           Error error = new Error();
           error.setMessage("NullTokenException: " + e.getMessage());
           HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
           return new ResponseEntity<Error>(error, status);
     } 
     
     
     @ExceptionHandler(value = LinkActivatedException.class)
     public ResponseEntity<Error> handleLinkActivatedException(LinkActivatedException e)
     {
           Error error = new Error();
           error.setMessage("LinkActivatedException: " + e.getMessage());
           HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
           return new ResponseEntity<Error>(error, status);
     } 
     
     
     @ExceptionHandler(value = MailjetException.class)
     public ResponseEntity<Error> handleMailjetException(MailjetException e)
     {
           Error error = new Error();
           error.setMessage("MailjetException: " + e.getMessage());
           HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
           return new ResponseEntity<Error>(error, status);
     } 
     
     @ExceptionHandler(value = MailjetSocketTimeoutException.class)
     public ResponseEntity<Error> handleMailjetSocketTimeoutException(MailjetSocketTimeoutException e)
     {
           Error error = new Error();
           error.setMessage("MailjetSocketTimeoutException: " + e.getMessage());
           HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
           return new ResponseEntity<Error>(error, status);
     } 
     
     @ExceptionHandler(value = EntityNotFoundException.class)
     public ResponseEntity<Error> handleEntityNotFoundException(EntityNotFoundException e)
     {
           Error error = new Error();
           error.setMessage("EntityNotFoundException: " + e.getMessage());
           HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
           return new ResponseEntity<Error>(error, status);
     } 
}