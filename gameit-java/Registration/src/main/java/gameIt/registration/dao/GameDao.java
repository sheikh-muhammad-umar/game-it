package gameIt.registration.dao;

import java.util.List;

import gameIt.registration.models.Game;
import gameIt.registration.models.Student;
import gameIt.registration.response.StudentGameResponse;

public interface GameDao {

    List<StudentGameResponse> getGamesForStudent(int id, String language); 
    List<Game> getAllGames(String language); 

    Game getGameById(int id);


}
