package gameIt.registration.response;

import java.util.Date;

public class GoalByGuardianResponse {
	
	private String assigneeFirstName;
	private String assigneeLastName;
    private String gameImage;
	private String skillName; 
	private String levelName; 
	private int targetGoal;
    private Date dateCreated;
    private Date timeFrame;
    private String status;
	private int amountOfCoins;
	
	
	
	public GoalByGuardianResponse(String assigneeFirstName, String assigneeLastName, String gameImage, String skillName,
			String levelName, int targetGoal, Date dateCreated, Date timeFrame, String status, int amountOfCoins) {
		super();
		this.assigneeFirstName = assigneeFirstName;
		this.assigneeLastName = assigneeLastName;
		this.gameImage = gameImage;
		this.skillName = skillName;
		this.levelName = levelName;
		this.targetGoal = targetGoal;
		this.dateCreated = dateCreated;
		this.timeFrame = timeFrame;
		this.status = status;
		this.amountOfCoins = amountOfCoins;
	}
	public String getAssigneeFirstName() {
		return assigneeFirstName;
	}
	public void setAssigneeFirstName(String assigneeFirstName) {
		this.assigneeFirstName = assigneeFirstName;
	}
	public String getAssigneeLastName() {
		return assigneeLastName;
	}
	public void setAssigneeLastName(String assigneeLastName) {
		this.assigneeLastName = assigneeLastName;
	}
	public String getGameImage() {
		return gameImage;
	}
	public void setGameImage(String gameImage) {
		this.gameImage = gameImage;
	}
	public String getSkillName() {
		return skillName;
	}
	public void setSkillName(String skillName) {
		this.skillName = skillName;
	}
	public String getLevelName() {
		return levelName;
	}
	public void setLevelName(String levelName) {
		this.levelName = levelName;
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
	public int getAmountOfCoins() {
		return amountOfCoins;
	}
	public void setAmountOfCoins(int amountOfCoins) {
		this.amountOfCoins = amountOfCoins;
	}
	

}
