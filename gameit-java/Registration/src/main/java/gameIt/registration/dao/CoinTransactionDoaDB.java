package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import gameIt.registration.dao.CoinTransactionDoaDB.CoinTransactionMapper;
import gameIt.registration.models.CoinTransaction;

@Repository
public class CoinTransactionDoaDB implements CoinTransactionDao{
	
	@Autowired
	JdbcTemplate jdbc;
	
	@Override
	public CoinTransaction getCointTransactionById(int id) {
		try {
			final String SELECT_COINTRANSACTION_BY_ID = "SELECT * FROM cointransaction WHERE GoalByGuardianID = ?";
			CoinTransaction coinTransaction = jdbc.queryForObject(SELECT_COINTRANSACTION_BY_ID, new CoinTransactionMapper(), id);

			return coinTransaction;
		} catch (DataAccessException ex) {
			return null;
		}
	}

	
	public CoinTransaction getCoinTransactionForGoal(int id) {
		try {
		final String SELECT_COINTRANSACTION_FOR_GOAL = "SELECT c.* FROM cointransaction c "
                + "JOIN goalbyguardian g ON g.CoinTransactionID = c.CoinTransactionID WHERE g.GoalByGuardianID = ?";
        return jdbc.queryForObject(SELECT_COINTRANSACTION_FOR_GOAL, new CoinTransactionMapper(), id);
		} catch (DataAccessException ex) {
			return null;
		}
	}
	
	
	@Override
	public CoinTransaction addCoinTransaction(CoinTransaction coinTransaction) {
		final String INSERT_COINTRANSACTION = "INSERT INTO cointransaction(FromUserID, ToUserID, AmountOfCoins, Status, TransactionDate, Reason) "
                + "VALUES(?,?,?,?,?,?)";
        jdbc.update(INSERT_COINTRANSACTION,
        		coinTransaction.getFromUserId(),
        		coinTransaction.getToUserId(),
        		coinTransaction.getAmountOfCoins(),
        		coinTransaction.getStatus(),
        		coinTransaction.getTransactionDate(),
        		coinTransaction.getReason());

        int newId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
        coinTransaction.setId(newId);	
        
        return coinTransaction;
	}

	@Override
	public CoinTransaction updateCoinTransaction(CoinTransaction coinTransaction) {
		final String UPDATE_COINTRANSACTION = "UPDATE cointransaction SET Status = ? WHERE CoinTransactionID = ?";
        jdbc.update(UPDATE_COINTRANSACTION, 
        		coinTransaction.getStatus(), 
        		coinTransaction.getId());
        return coinTransaction;
	}
	
	
	public static final class CoinTransactionMapper implements RowMapper<CoinTransaction> {

		@Override
		public CoinTransaction mapRow(ResultSet rs, int index) throws SQLException {
			CoinTransaction coinTransaction = new CoinTransaction();
			coinTransaction.setId(rs.getInt("CoinTransactionID"));
			coinTransaction.setFromUserId(rs.getInt("FromUserID"));
			coinTransaction.setToUserId(rs.getInt("ToUserID"));
			coinTransaction.setAmountOfCoins(rs.getInt("AmountOfCoins"));
			coinTransaction.setStatus(rs.getString("Status"));
			coinTransaction.setTransactionDate(rs.getDate("TransactionDate"));
			coinTransaction.setReason(rs.getString("Reason"));
            
			return coinTransaction;
		}
	}	
	

}
