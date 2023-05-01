package gameIt.registration.response;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class StudentInfoResponse {

	 
	 private String firstName;
	 private String lastName;
	 private String username;
	 private String password;

	
	@DateTimeFormat(pattern = "yyyy/mm/dd")
    private Date birthdate;
    private String school;
    private String diagnoses;
    private String country;
    private String city;
    
   
    
	
	public StudentInfoResponse(String firstName, String lastName, String username, String password, Date birthdate,
			String school, String diagnoses, String country, String city) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.password = password;
		this.birthdate = birthdate;
		this.school = school;
		this.diagnoses = diagnoses;
		this.country = country;
		this.city = city;
	}
	public Date getBirthdate() {
		return birthdate;
	}
	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}
	public String getSchool() {
		return school;
	}
	public void setSchool(String school) {
		this.school = school;
	}
	public String getDiagnoses() {
		return diagnoses;
	}
	public void setDiagnoses(String diagnoses) {
		this.diagnoses = diagnoses;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
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
	
    
    
    
}
