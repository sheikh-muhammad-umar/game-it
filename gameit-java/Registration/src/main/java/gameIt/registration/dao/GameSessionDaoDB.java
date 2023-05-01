package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import gameIt.registration.dao.GameDaoDB.StudentGameResponseMapper;
import gameIt.registration.dao.GuardianDaoDB.GuardianMapper;
import gameIt.registration.models.GameSession;
import gameIt.registration.models.StudentGame;
import gameIt.registration.response.GameSessionResponse;

@Repository
public class GameSessionDaoDB implements GameSessionDao{

	@Autowired
	JdbcTemplate jdbc;

	
	@Override
	public GameSession addGameSession(GameSession gamesession) {
		final String INSERT_GAME_SESSION = "INSERT INTO gamesession(StudentID, GameID, SessionData, SessionType, Date) "
				+ "VALUES(?,?,?,?,?)";

		jdbc.update(INSERT_GAME_SESSION, gamesession.getStudent().getId(), gamesession.getGame().getId(),
				gamesession.getSessionData(), gamesession.getSessionType(), gamesession.getCreatedDate());

		return gamesession;
	}


	@Override
	public List<GameSessionResponse> getGameSessionData(int studentId, int gameId) {
		final String SELECT_GAMESESSION_FOR_STUDENT = "SELECT gamesession.SessionType, gamesession.SessionData, gamesession.Date from gamesession where StudentId= ? and GameID = ?";

		return jdbc.query(SELECT_GAMESESSION_FOR_STUDENT, new GameSessionResponseMapper(), studentId, gameId);

	}

	@Override
	public List<GameSessionResponse> getGameSessionData(int studentId) {
		final String SELECT_GAMESESSION_FOR_STUDENT = "SELECT gamesession.SessionType, gamesession.SessionData, gamesession.Date from gamesession where StudentId= ?";

		return jdbc.query(SELECT_GAMESESSION_FOR_STUDENT, new GameSessionResponseMapper(), studentId);

	}
	 
	public static final class GameSessionMapper implements RowMapper<GameSession> {

		@Override
		public GameSession mapRow(ResultSet rs, int index) throws SQLException {
			GameSession gameSession = new GameSession();
			gameSession.setId(rs.getInt("GameSessionID"));
			gameSession.setSessionData(rs.getString("SessionData"));
			gameSession.setSessionType(rs.getString("SessionType"));			
			return gameSession;
		}
	}

	public static final class GameSessionResponseMapper implements RowMapper<GameSessionResponse> {

		@Override
		public GameSessionResponse mapRow(ResultSet rs, int index) throws SQLException {
			GameSessionResponse gameSessionResponse = new GameSessionResponse();
			gameSessionResponse.setSessionData(new JSONObject(rs.getString("SessionData")).toMap());
			gameSessionResponse.setSessionType(rs.getString("SessionType"));
			gameSessionResponse.setCreatedDate(rs.getTimestamp("Date"));
			return gameSessionResponse;
		}
	}
}
