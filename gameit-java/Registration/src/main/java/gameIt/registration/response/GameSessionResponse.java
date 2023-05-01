package gameIt.registration.response;

import java.util.Date;
import java.util.Map;
import java.util.Objects;


public class GameSessionResponse {

	private Map<String, Object> SessionData;
    private Date createdDate;
	private String sessionType;
    
	public Map<String, Object> getSessionData() {
		
		return SessionData;
	}
	public void setSessionData(Map<String, Object> sessionData) {
		SessionData= sessionData;
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	
	public String getSessionType() {
		return sessionType;
	}
	public void setSessionType(String sessionType) {
		this.sessionType = sessionType;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(SessionData, createdDate);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		GameSessionResponse other = (GameSessionResponse) obj;
		return Objects.equals(SessionData, other.SessionData) && Objects.equals(createdDate, other.createdDate);
	}
    
    
}
