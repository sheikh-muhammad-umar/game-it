package gameIt.registration.models;

import java.util.Date;
import java.util.UUID;

import net.bytebuddy.utility.RandomString;

public class StudentGame {
	
	private int id;
    private Student student;
    private Game game;
    private String gameSessionKey;
    private String installationToken;
    private Date createdDate;
    private String instructions;
    
    public StudentGame() {}

    public StudentGame(Student student, Game game) {
		this.student = student;
		this.game = game;

		gameSessionKey = UUID.randomUUID().toString();
		installationToken = RandomString.make(6);
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

	public String getGameSessionKey() {
		return gameSessionKey;
	}

	public void setGameSessionKey(String gameSessionKey) {
		this.gameSessionKey = gameSessionKey;
	}

	public String getInstallationToken() {
		return installationToken;
	}

	public void setInstallationToken(String installationToken) {
		this.installationToken = installationToken;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}


}
