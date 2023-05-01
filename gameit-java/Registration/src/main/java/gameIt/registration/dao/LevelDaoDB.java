package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import gameIt.registration.models.Level;

@Repository
public class LevelDaoDB implements LevelDao{

	@Autowired
	JdbcTemplate jdbc;

	@Override
	public Level getLevelById(int id) {
		try {
			final String SELECT_LEVEL_BY_ID = "SELECT * FROM level WHERE LevelID = ?";
			Level level = jdbc.queryForObject(SELECT_LEVEL_BY_ID, new LevelMapper(), id);

			return level;
		} catch (DataAccessException ex) {
			return null;
		}
	}
	
	public static final class LevelMapper implements RowMapper<Level> {

		@Override
		public Level mapRow(ResultSet rs, int index) throws SQLException {
			Level level = new Level();
			level.setId(rs.getInt("LevelID"));
			level.setLevelName(rs.getString("LevelName"));
			
			return level;
		}
	}

}
