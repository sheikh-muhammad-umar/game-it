package gameIt.registration.dao;

import java.util.List;

import gameIt.registration.models.CoinTransaction;
import gameIt.registration.models.GoalByGuardian;

public interface GoalByGuardianDao {
	
    GoalByGuardian getGoalByGuardianById(int id);
    List<GoalByGuardian> getGoalsByGuardianByAssigner(int id);

	void addGoalByGuardian(GoalByGuardian goalByGuardian);
	void updateGoalByGuardian(GoalByGuardian goalByGuardian);
	void deleteGoalByGuardianById(Integer goalByGuardianId);
	
}
