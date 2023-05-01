package gameIt.registration.exception;

public class EmailAlreadyExistsException extends Exception {
	public EmailAlreadyExistsException(String errorMessage) {
        super(errorMessage);
    }
}
