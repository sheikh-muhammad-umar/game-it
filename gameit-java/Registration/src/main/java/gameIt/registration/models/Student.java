package gameIt.registration.models;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.springframework.data.annotation.Transient;
import org.springframework.format.annotation.DateTimeFormat;

public class Student {
	
	private int id;
	
	@DateTimeFormat(pattern = "yyyy/mm/dd")
    private Date birthdate;
	
    private String school;
    private String diagnoses;
    private String country;
    private String city;
    private String photo;
    private String photosImagePath;
    
    private User user;
    private UserEntity userEntity;
    private List<Guardian> guardians;
    
    
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public String getPhoto() {
		return photo;
	}
	public void setPhoto(String photo) {
		this.photo = photo;
	}
	
	 @Transient
	    public String getPhotosImagePath() {
	        if (photo == null || id == 0) return null;
	         
	        return "/user-photos/" + id + "/" + photo;
	    }
	 
	 
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	
	
	public UserEntity getUserEntity() {
		return userEntity;
	}
	public void setUserEntity(UserEntity userEntity) {
		this.userEntity = userEntity;
	}
	
	public List<Guardian> getGuardians() {
		return guardians;
	}
	public void setGuardians(List<Guardian> guardians) {
		this.guardians = guardians;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(birthdate, city, country, diagnoses, guardians, id, photo, school, user);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Student other = (Student) obj;
		return Objects.equals(birthdate, other.birthdate) && Objects.equals(city, other.city)
				&& Objects.equals(country, other.country) && Objects.equals(diagnoses, other.diagnoses)
				&& Objects.equals(guardians, other.guardians) && id == other.id && Objects.equals(photo, other.photo)
				&& Objects.equals(school, other.school) && Objects.equals(user, other.user);
	}
	@Override
	public String toString() {
		return "Student [id=" + id + ", birthdate=" + birthdate + ", school=" + school + ", diagnoses=" + diagnoses
				+ ", country=" + country + ", city=" + city + ", photo=" + photo + ", photosImagePath="
				+ photosImagePath + ", user=" + user + ", guardians=" + guardians + "]";
	}
	
	  

}
