package gameIt.registration.request;

public class ResetPasswordRequest {
	private String token;
	private String password;
	
	public String getToken() {
		return this.token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
