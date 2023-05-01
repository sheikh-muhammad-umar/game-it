package gameIt.registration.models;

import java.util.Date;

public class GoalByGuardian {
	
	private int id;
	private int assignerID;
	private int assigneeID;
    private int gameId;
	private int skillId; 
	private int levelId; 
	private int targetGoal;
    private Date dateCreated;
    private Date timeFrame;
    private String status;
    private CoinTransaction coinTransaction;
       
    
	public GoalByGuardian() {
		dateCreated = new Date();
	}
	
	
	public int getAssignerID() {
		return assignerID;
	}


	public void setAssignerID(int assignerID) {
		this.assignerID = assignerID;
	}


	public int getAssigneeID() {
		return assigneeID;
	}


	public void setAssigneeID(int assigneeID) {
		this.assigneeID = assigneeID;
	}


	public CoinTransaction getCoinTransaction() {
		return coinTransaction;
	}


	public void setCoinTransaction(CoinTransaction coinTransaction) {
		this.coinTransaction = coinTransaction;
	}


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	
	public int getGameId() {
		return gameId;
	}


	public void setGameId(int gameId) {
		this.gameId = gameId;
	}


	public int getSkillId() {
		return skillId;
	}


	public void setSkillId(int skillId) {
		this.skillId = skillId;
	}


	public int getLevelId() {
		return levelId;
	}


	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}


	public int getTargetGoal() {
		return targetGoal;
	}

	public void setTargetGoal(int targetGoal) {
		this.targetGoal = targetGoal;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public Date getTimeFrame() {
		return timeFrame;
	}

	public void setTimeFrame(Date timeFrame) {
		this.timeFrame = timeFrame;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
    
    
}
