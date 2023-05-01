package gameIt.registration.models;

import java.util.List;
import java.util.Objects;

public class Game {

	private int id;
	private String ability;
	private String description; 
	private double version; 
	private String image;
	
	
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
	@Override
	public int hashCode() {
		return Objects.hash(ability, description, id, image, version);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Game other = (Game) obj;
		return Objects.equals(ability, other.ability) && Objects.equals(description, other.description)
				&& id == other.id && Objects.equals(image, other.image)
				&& Double.doubleToLongBits(version) == Double.doubleToLongBits(other.version);
	}
	@Override
	public String toString() {
		return "Game [id=" + id + ", ability=" + ability + ", description=" + description + ", version=" + version
				+ ", image=" + image + "]";
	}
	
}
