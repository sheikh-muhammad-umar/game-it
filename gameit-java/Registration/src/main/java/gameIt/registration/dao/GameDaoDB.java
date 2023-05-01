package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import gameIt.registration.dao.StudentDaoDB.StudentMapper;
import gameIt.registration.models.Game;
import gameIt.registration.models.Student;
import gameIt.registration.response.StudentGameResponse;

@Repository
public class GameDaoDB implements GameDao {

	@Autowired
	JdbcTemplate jdbc;

	@Override
	public List<StudentGameResponse> getGamesForStudent(int id, String language) {
		final String SELECT_GAMES_FOR_STUDENT;
		
		if(language.equals("ar")) {
		 SELECT_GAMES_FOR_STUDENT = "SELECT DISTINCT game.GameID, game.DiffLanguages ->>'$.ar.Ability' AS Ability,"
				+ " game.DiffLanguages ->>'$.ar.Description' AS Description, game.Version, game.Image, studentgame.StudentGameID, studentgame.GameSessionKey,"
				+ " studentgame.Instructions FROM game "
				+ "JOIN studentgame ON studentgame.GameID = game.GameID WHERE studentgame.StudentID = ?";
		 
		}else{
		 SELECT_GAMES_FOR_STUDENT = "SELECT DISTINCT game.GameID, game.DiffLanguages ->>'$.en.Ability' AS Ability,"
					+ " game.DiffLanguages ->>'$.en.Description' AS Description, game.Version, game.Image, studentgame.StudentGameID, studentgame.GameSessionKey,"
					+ " studentgame.Instructions FROM game "
					+ "JOIN studentgame ON studentgame.GameID = game.GameID WHERE studentgame.StudentID = ?";
		}
		
		return jdbc.query(SELECT_GAMES_FOR_STUDENT, new StudentGameResponseMapper(), id);

	}

	@Override
	public Game getGameById(int id) {
		try {
			final String SELECT_GAME_BY_ID = "SELECT GameID, DiffLanguages ->>'$.en.Ability' AS Ability, DiffLanguages ->>'$.en.Description' AS Description, Version, Image FROM game WHERE GameID = ?";
			Game game = jdbc.queryForObject(SELECT_GAME_BY_ID, new GameMapper(), id);
			return game;
		} catch (DataAccessException ex) {
			return null;
		}
	}

	@Override
	public List<Game> getAllGames(String language) {
		
		final String SELECT_ALL_GAMES;
		
		if(language.equals("ar")) {
		SELECT_ALL_GAMES = "SELECT DISTINCT GameID, DiffLanguages ->>'$.ar.Ability' AS Ability, DiffLanguages ->>'$.ar.Description' AS Description, Version, Image FROM game";
		} else {
		SELECT_ALL_GAMES = "SELECT DISTINCT GameID, DiffLanguages ->>'$.en.Ability' AS Ability, DiffLanguages ->>'$.en.Description' AS Description, Version, Image FROM game";
	
		}
		return jdbc.query(SELECT_ALL_GAMES, new GameMapper());

	}

	public static final class StudentGameResponseMapper implements RowMapper<StudentGameResponse> {

		@Override
		public StudentGameResponse mapRow(ResultSet rs, int index) throws SQLException {
			StudentGameResponse game = new StudentGameResponse();
			game.setId(rs.getInt("GameID"));
			game.setAbility(rs.getString("Ability"));
			game.setDescription(rs.getString("Description"));
			game.setVersion(rs.getDouble("Version"));
			game.setImage(rs.getString("Image"));
			game.setStudentGameId(rs.getInt("StudentGameID"));
			game.setInstructions(rs.getString("Instructions"));
			game.setGameSessionKey(rs.getString("GameSessionKey"));

			return game;
		}
	}

	public static final class GameMapper implements RowMapper<Game> {

		@Override
		public Game mapRow(ResultSet rs, int index) throws SQLException {
			Game game = new Game();
			game.setId(rs.getInt("GameID"));
			game.setAbility(rs.getString("Ability"));
			game.setDescription(rs.getString("Description"));
			game.setVersion(rs.getDouble("Version"));
			game.setImage(rs.getString("Image"));
			return game;
		}
	}

}
