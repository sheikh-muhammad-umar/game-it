package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import gameIt.registration.models.Skill;

@Repository
public class SkillDaoDB implements SkillDao{

	@Autowired
	JdbcTemplate jdbc;

	@Override
	public Skill getSkillById(int id) {
		try {
			final String SELECT_SKILL_BY_ID = "SELECT * FROM skill WHERE SkillID = ?";
			Skill skill = jdbc.queryForObject(SELECT_SKILL_BY_ID, new SkillMapper(), id);

			return skill;
		} catch (DataAccessException ex) {
			return null;
		}
	}
	
	public static final class SkillMapper implements RowMapper<Skill> {

		@Override
		public Skill mapRow(ResultSet rs, int index) throws SQLException {
			Skill skill = new Skill();
			skill.setId(rs.getInt("SkillID"));
			skill.setSkillName(rs.getString("SkillName"));
			skill.setSkillDescription(rs.getString("SkillDescription"));

			return skill;
		}
	}


}
