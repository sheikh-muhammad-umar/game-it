package gameIt.registration.dao;

import java.util.List;

import gameIt.registration.models.Game;
import gameIt.registration.models.Guardian;
import gameIt.registration.models.Student;
import gameIt.registration.models.StudentGame;

public interface StudentGameDao {

	StudentGame addStudentGame(StudentGame studentgame);
	StudentGame getStudentGameById(int id);
	String getGameSessionKeyByToken(String token);
	Game getGameByGameSessionKey(String key);
	Student getStudentByGameSessionKey(String key);
	List<Student> getAllStudentsForGuardianAndGame(int guardianId, int gameId);
	StudentGame getStudentGameByGameSessionKey(String gameSessionKey);
	Game getGameByToken(String key);
}
