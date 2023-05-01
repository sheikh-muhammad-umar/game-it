package gameIt.registration.response;

import java.util.List;
import java.util.Objects;

public class StudentGameResponse {

	private int id;
	private String ability;
	private String description; 
	private double version; 
	private String image;
	private int studentGameId;
    private String instructions;
    private String gameSessionKey;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAbility() {
		return ability;
	}
	public void setAbility(String ability) {
		this.ability = ability;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public double getVersion() {
		return version;
	}
	public void setVersion(double version) {
		this.version = version;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public int getStudentGameId() {
		return studentGameId;
	
	}
	public void setStudentGameId(int studentGameId) {
		this.studentGameId= studentGameId;
	}	
	public String getGameSessionKey() {
		return gameSessionKey;
	}
	public void setGameSessionKey(String gameSessionKey) {
		this.gameSessionKey = gameSessionKey;
	}
	public String getInstructions() {
		return instructions;
	}
	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(ability, description, id, image, instructions, studentGameId, version);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		StudentGameResponse other = (StudentGameResponse) obj;
		return Objects.equals(ability, other.ability) && Objects.equals(description, other.description)
				&& id == other.id && Objects.equals(image, other.image)
				&& Objects.equals(instructions, other.instructions) && studentGameId == other.studentGameId
				&& Double.doubleToLongBits(version) == Double.doubleToLongBits(other.version);
	}
	@Override
	public String toString() {
		return "StudentGameResponse [id=" + id + ", ability=" + ability + ", description=" + description + ", version="
				+ version + ", image=" + image + ", studentGameId=" + studentGameId + ", instructions=" + instructions
				+ "]";
	}
	
	
}
