package gameIt.registration.models;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

public class User {

	
	
	private int id;
	private String username;
	private String firstName;
    private String lastName;
    private String password;
    private String userType;
    
   
    
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	 public String getUsername() {
			return username;
		}
		public void setUsername(String username) {
			this.username = username;
		}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}	
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	@Override
	public int hashCode() {
		return Objects.hash(firstName, id, lastName, password, userType, username);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		User other = (User) obj;
		return Objects.equals(firstName, other.firstName) && id == other.id && Objects.equals(lastName, other.lastName)
				&& Objects.equals(password, other.password) && Objects.equals(userType, other.userType)
				&& Objects.equals(username, other.username);
	}
	@Override
	public String toString() {
		return "User [id=" + id + ", username=" + username + ", firstName=" + firstName + ", lastName=" + lastName
				+ ", password=" + password + ", userType=" + userType + "]";
	}
	public void setResetPasswordToken(Object object) {
		// TODO Auto-generated method stub
		
	}
	
    
    
}