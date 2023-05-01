package gameIt.registration.models;

import java.util.Date;

public class Skill {

	private int id;
	private String skillName; 
	private String skillDescription;
	
	
	public Skill() {}
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getSkillName() {
		return skillName;
	}
	public void setSkillName(String skillName) {
		this.skillName = skillName;
	}
	public String getSkillDescription() {
		return skillDescription;
	}
	public void setSkillDescription(String skillDescription) {
		this.skillDescription = skillDescription;
	} 
	
    
}
