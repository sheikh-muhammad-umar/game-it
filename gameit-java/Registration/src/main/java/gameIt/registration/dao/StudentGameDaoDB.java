package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import gameIt.registration.dao.GameDaoDB.GameMapper;
import gameIt.registration.dao.GuardianDaoDB.GuardianMapper;
import gameIt.registration.dao.StudentDaoDB.StudentMapper;
import gameIt.registration.models.Game;
import gameIt.registration.models.Guardian;
import gameIt.registration.models.Student;
import gameIt.registration.models.StudentGame;

@Repository
public class StudentGameDaoDB implements StudentGameDao {

	@Autowired
	JdbcTemplate jdbc;

	public StudentGame addStudentGame(StudentGame studentGame) {
		final String INSERT_STUDENT_GAME = "INSERT INTO studentgame(StudentID, GameID, GameSessionKey, InstallationToken, CreatedDate, Instructions) "
				+ "VALUES(?,?,?,?,?,?)";

		jdbc.update(INSERT_STUDENT_GAME, studentGame.getStudent().getId(), studentGame.getGame().getId(),
				studentGame.getGameSessionKey(), studentGame.getInstallationToken(), studentGame.getCreatedDate(),
				studentGame.getInstructions());

		return studentGame;
	}

	@Override
	public StudentGame getStudentGameById(int id) {
		try {
			final String SELECT_STUDENTGAME_BY_ID = "SELECT * FROM studentgame WHERE StudentGameID = ?";
			StudentGame studentGame = jdbc.queryForObject(SELECT_STUDENTGAME_BY_ID, new StudentGameMapper(), id);
			return studentGame;
		} catch (DataAccessException ex) {
			return null;
		}
	}

	@Override
	public String getGameSessionKeyByToken(String token) {

		final String SELECT_GAMESESSIONKEY_BY_TOKEN = "SELECT studentgame.GameSessionKey FROM studentgame WHERE studentgame.InstallationToken = ?";
//		final String SELECT_GAMESESSIONKEY_BY_TOKEN2 = "SELECT studentgame.* FROM studentgame WHERE studentgame.InstallationToken = ?";

//		StudentGame studentGame = jdbc.queryForObject(SELECT_GAMESESSIONKEY_BY_TOKEN2, new StudentGameMapper(), token);
//		String gameSessionKey2 = studentGame.getGameSessionKey();

		String gameSessionKey = (String) jdbc.queryForObject(SELECT_GAMESESSIONKEY_BY_TOKEN, String.class,
				new Object[] { token });

		return gameSessionKey;
//		    return gameSessionKey2;	

	}

	@Override
	public Game getGameByGameSessionKey(String key) {
		final String SELECT_GAME_BY_KEY = "SELECT game.* FROM game JOIN studentgame ON game.GameID = studentgame.GameID where studentgame.GameSessionKey = ?";

		Game game = jdbc.queryForObject(SELECT_GAME_BY_KEY, new GameMapper(), key);

		return game;
	}
	
	@Override
	public Game getGameByToken(String token) {
		final String SELECT_GAME_BY_KEY = "SELECT game.* FROM game JOIN studentgame ON game.GameID = studentgame.GameID where studentgame.InstallationToken = ?";

		Game game = jdbc.queryForObject(SELECT_GAME_BY_KEY, new GameMapper(), token);

		return game;
	}

	@Override
	public Student getStudentByGameSessionKey(String key) {
		final String SELECT_Student_BY_KEY = "SELECT student.* FROM student JOIN studentgame ON student.StudentID = studentgame.StudentID "
				+ "where studentgame.GameSessionKey = ?";

		Student student = jdbc.queryForObject(SELECT_Student_BY_KEY, new StudentMapper(), key);

		return student;
	}

	@Override
	public List<Student> getAllStudentsForGuardianAndGame(int guardianId, int gameId) {
		final String SELECT_STUDENTS_FOR_GAME = "SELECT student.* FROM student JOIN guardiantostudent ON guardiantostudent.StudentID = student.StudentID "
				+ "JOIN studentgame ON studentgame.StudentID = guardiantostudent.StudentID WHERE guardiantostudent.GuardianID = ? AND studentgame.GameID = ?";
		List<Student> students = jdbc.query(SELECT_STUDENTS_FOR_GAME, new StudentMapper(), guardianId, gameId);
		return students;
	}

	@Override
	public StudentGame getStudentGameByGameSessionKey(String gameSessionKey) {
		try {
			final String SELECT_STUDENTGAME_BY_GAMESESSIONKEY = "SELECT * FROM studentgame WHERE GameSessionKey = ?";
			StudentGame studentGame = jdbc.queryForObject(SELECT_STUDENTGAME_BY_GAMESESSIONKEY, new StudentGameMapper(), gameSessionKey);
			
			return studentGame;
		} catch (DataAccessException ex) {
			return null;
		}
	}
	
	public static final class StudentGameMapper implements RowMapper<StudentGame> {

		@Override
		public StudentGame mapRow(ResultSet rs, int index) throws SQLException {
			StudentGame studentGame = new StudentGame();
			studentGame.setId(rs.getInt("StudentGameID"));
			studentGame.setGameSessionKey(rs.getString("GameSessionKey"));
			studentGame.setInstallationToken(rs.getString("InstallationToken"));

			return studentGame;
		}
	}

	

}
