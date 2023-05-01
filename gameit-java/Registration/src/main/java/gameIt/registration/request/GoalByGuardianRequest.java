package gameIt.registration.request;

import java.util.Date;

import gameIt.registration.models.Level;
import gameIt.registration.models.Skill;

public class GoalByGuardianRequest {

	private int studentID;
    private int gameId;
	private int skillId; 
	private int levelId; 
	private int targetGoal;
	private int coins;
    private Date timeFrame;
    
    
	public int getStudentID() {
		return studentID;
	}
	public void setStudentID(int studentID) {
		this.studentID = studentID;
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
	public int getCoins() {
		return coins;
	}
	public void setCoins(int coins) {
		this.coins = coins;
	}
	public Date getTimeFrame() {
		return timeFrame;
	}
	public void setTimeFrame(Date timeFrame) {
		this.timeFrame = timeFrame;
	}
    
    
}
