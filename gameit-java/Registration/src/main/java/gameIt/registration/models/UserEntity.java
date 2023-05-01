package gameIt.registration.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
//import javax.validation.constraints.NotBlank;

@Entity
//@Table(name = "user", uniqueConstraints={@UniqueConstraint(columnNames={"username"})})
@Table(name = "user")
public class UserEntity implements Serializable{

	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "UserID")
	private long userid;

	@Column(name = "Username", nullable = false)
//	@NotBlank(message = "Name must not be empty.")
	private String username;

	@Column(name = "Email")
	private String emailId;

	@Column(name = "PasswordHash", nullable = false)
	private String password;

	@Column(name = "FirstName", nullable = false)
	private String firstName;

	@Column(name = "LastName", nullable = false)
	private String lastName;
	
	@Column(name = "UserType")
	private String userType;
	
	@Column(name = "CreationTime")
	private LocalDateTime creationTime;
	
	@Column(name = "UpdatedTime")
	private LocalDateTime updatedTime;
	
	@Column(name = "LastSeen")
	private LocalDateTime lastSeen;
	
	@Column(name = "ExpiryDate")
	private LocalDateTime expiryDate;
	
	@Column(name = "Coin")
	private Integer coin;
	
	@Column(name = "Active")
	private Integer active;
	
	@Column(name = "EmailFlag") 
	private Boolean emailFlag;
	
	@Column(name = "isEnabled") // for accountConfirmationToken activated
	private Boolean isEnabled;

	@Column(name = "reset_password_token")
    private String resetPasswordToken;
	
	@Column(name = "Deleted") 
	private Boolean deleted;
	
	public long getUserid() {
		return userid;
	}

	public void setUserid(long userid) {
		this.userid = userid;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getUserName() {
		return username;
	}

	public void setUserName(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public Boolean isEnabled() {
		return isEnabled;
	}

	public void setEnabled(Boolean isEnabled) {
		this.isEnabled = isEnabled;
	}
	
	public String getUserType() {
		return userType;
	}
	
	public void setUserType(String userType) {
		this.userType = userType;
	}
	
	public LocalDateTime getCreationTime() {
		return creationTime;
	}

	public void setCreationTime(LocalDateTime creationTime) {
		this.creationTime = creationTime;
	}

	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}

	public LocalDateTime getLastSeen() {
		return lastSeen;
	}

	public void setLastSeen(LocalDateTime lastSeen) {
		this.lastSeen = lastSeen;
	}

	public LocalDateTime getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDateTime expiryDate) {
		this.expiryDate = expiryDate;
	}

	public Integer getCoin() {
		return coin;
	}

	public void setCoin(Integer coin) {
		this.coin = coin;
	}

	public Integer getActive() {
		return active;
	}

	public void setActive(Integer active) {
		this.active = active;
	}

	public Boolean isEmailFlag() {
		return emailFlag;
	}

	public void setEmailFlag(Boolean emailFlag) {
		this.emailFlag = emailFlag;
	}

	public String getResetPasswordToken() {
		return resetPasswordToken;
	}

	public void setResetPasswordToken(String resetPasswordToken) {
		this.resetPasswordToken = resetPasswordToken;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

	
}