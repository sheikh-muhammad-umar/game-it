package gameIt.registration.models;

//import java.sql.Blob;
import java.util.Date;
import java.util.Objects;
//some change
public class GameSession {

	private int id;
	private Student student;
    private Game game;
	private String sessionData; 
	private String sessionType; 
	private int scoreEarned;
	private int minutesInGame;
    private Date createdDate;
    
    public GameSession() {}

    
	public GameSession(Student student, Game game) {
		this.student = student;
		this.game = game;
        createdDate = new Date();
	}
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public Student getStudent() {
		return student;
	}


	public void setStudent(Student student) {
		this.student = student;
	}


	public Game getGame() {
		return game;
	}


	public void setGame(Game game) {
		this.game = game;
	}


	public String getSessionData() {
		return sessionData;
	}
	public void setSessionData(String sessionData) {
		this.sessionData = sessionData;
	}
	
	public String getSessionType() {
		return sessionType;
	}
	
	public void setSessionType(String sessionType) {
		this.sessionType = sessionType;
	}

	public int getScoreEarned() {
		return scoreEarned;
	}
	public void setScoreEarned(int scoreEarned) {
		this.scoreEarned = scoreEarned;
	}
	public int getMinutesInGame() {
		return minutesInGame;
	}
	public void setMinutesInGame(int minutesInGame) {
		this.minutesInGame = minutesInGame;
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	
}
