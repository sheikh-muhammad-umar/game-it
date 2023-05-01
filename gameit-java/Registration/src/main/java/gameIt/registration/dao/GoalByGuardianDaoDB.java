package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import gameIt.registration.dao.CoinTransactionDoaDB.CoinTransactionMapper;
import gameIt.registration.models.CoinTransaction;
import gameIt.registration.models.GoalByGuardian;

@Repository
public class GoalByGuardianDaoDB implements GoalByGuardianDao {

	@Autowired
	JdbcTemplate jdbc;

	@Autowired
	CoinTransactionDao coinTransactionDao;

	@Override
	public GoalByGuardian getGoalByGuardianById(int id) {
		try {
			final String SELECT_GOAL_BY_GUARDIAN_BY_ID = "SELECT * FROM goalbyguardian WHERE GoalByGuardianID = ?";
			GoalByGuardian goalByGuardian = jdbc.queryForObject(SELECT_GOAL_BY_GUARDIAN_BY_ID,
					new GoalByGuardianMapper(), id);
			goalByGuardian.setCoinTransaction(coinTransactionDao.getCoinTransactionForGoal(id));

			return goalByGuardian;
		} catch (DataAccessException ex) {
			return null;
		}
	}

	@Override
	public void addGoalByGuardian(GoalByGuardian goalByGuardian) {
		Integer coinTransactionID;
		if (goalByGuardian.getCoinTransaction() == null) {
			coinTransactionID = null;
		} else {
			coinTransactionID = goalByGuardian.getCoinTransaction().getId();
		}

		final String INSERT_GOAL = "INSERT INTO goalbyguardian(AssignerID, AssigneeID, GameID, SkillID, LevelID, TargetGoal, DateCreated, TimeFrame, Status, CoinTransactionID) "
				+ "VALUES(?,?,?,?,?,?,?,?,?,?)";
		jdbc.update(INSERT_GOAL, goalByGuardian.getAssignerID(), goalByGuardian.getAssigneeID(),
				goalByGuardian.getGameId(), goalByGuardian.getSkillId(), goalByGuardian.getLevelId(),
				goalByGuardian.getTargetGoal(), goalByGuardian.getDateCreated(), goalByGuardian.getTimeFrame(),
				goalByGuardian.getStatus(), coinTransactionID); // test the case where no transaction so
																	// CoinTransaction = null

		int newId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
		goalByGuardian.setId(newId);
	}

	@Override
	public void updateGoalByGuardian(GoalByGuardian goalByGuardian) {
		final String UPDATE_GOAL_BY_GUARDIAN = "UPDATE goalbyguardian SET Status = ? WHERE GoalByGuardianID = ?";
		jdbc.update(UPDATE_GOAL_BY_GUARDIAN, goalByGuardian.getStatus(), goalByGuardian.getId());
	}

	

	@Override
	public List<GoalByGuardian> getGoalsByGuardianByAssigner(int id) {
		try {
			final String SELECT_GOALS_BY_GUARDIAN_BY_ASSIGNER = "SELECT * FROM goalbyguardian WHERE AssignerID = ? AND Deleted IS NULL";
			List<GoalByGuardian> goalsByGuardian = jdbc.query(SELECT_GOALS_BY_GUARDIAN_BY_ASSIGNER,
					new GoalByGuardianMapper(), id);

			for (GoalByGuardian goalByGuardian : goalsByGuardian) {
				goalByGuardian.setCoinTransaction(coinTransactionDao.getCoinTransactionForGoal(goalByGuardian.getId()));
			}

			return goalsByGuardian;
		} catch (DataAccessException ex) {
			return null;
		}
	}

	@Override
	@Transactional
	public void deleteGoalByGuardianById(Integer goalByGuardianId) {

		if (coinTransactionDao.getCoinTransactionForGoal(goalByGuardianId) != null) {

			final String DELETE_COINTRANSACTION = "UPDATE cointransaction SET Deleted = True WHERE CoinTransactionID = ?";
			jdbc.update(DELETE_COINTRANSACTION, coinTransactionDao.getCoinTransactionForGoal(goalByGuardianId).getId());

		}

		final String DELETE_GOAL_BY_GUARDIAN = "UPDATE goalbyguardian SET Deleted = True WHERE GoalByGuardianID = ?";
		jdbc.update(DELETE_GOAL_BY_GUARDIAN, goalByGuardianId);
	}
	
	
	public static final class GoalByGuardianMapper implements RowMapper<GoalByGuardian> {

		@Override
		public GoalByGuardian mapRow(ResultSet rs, int index) throws SQLException {
			GoalByGuardian goalByGuardian = new GoalByGuardian();
			goalByGuardian.setId(rs.getInt("GoalByGuardianID"));
			goalByGuardian.setAssignerID(rs.getInt("AssignerID"));
			goalByGuardian.setAssigneeID(rs.getInt("AssigneeID"));
			goalByGuardian.setGameId(rs.getInt("GameID"));
			goalByGuardian.setSkillId(rs.getInt("SkillID"));
			goalByGuardian.setLevelId(rs.getInt("LevelID"));
			goalByGuardian.setTargetGoal(rs.getInt("TargetGoal"));
			goalByGuardian.setDateCreated(rs.getDate("DateCreated"));
			goalByGuardian.setTimeFrame(rs.getDate("TimeFrame"));
			goalByGuardian.setStatus(rs.getString("Status"));

			return goalByGuardian;
		}
	}

}
