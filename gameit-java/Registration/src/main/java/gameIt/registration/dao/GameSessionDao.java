package gameIt.registration.dao;

import java.util.List;

import gameIt.registration.models.GameSession;
import gameIt.registration.models.StudentGame;
import gameIt.registration.response.GameSessionResponse;

public interface GameSessionDao {
	GameSession addGameSession(GameSession gamesession);
    List<GameSessionResponse> getGameSessionData(int StudentID, int GameID);
	List<GameSessionResponse> getGameSessionData(int studentId);

}
