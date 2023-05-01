package gameIt.registration.exception;

public class UsernameAlreadyExistsException extends Exception {
	public UsernameAlreadyExistsException(String errorMessage) {
        super(errorMessage);
    }
}
