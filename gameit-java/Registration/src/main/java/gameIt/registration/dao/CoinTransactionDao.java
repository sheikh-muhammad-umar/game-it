package gameIt.registration.dao;

import gameIt.registration.models.CoinTransaction;
import gameIt.registration.models.GoalByGuardian;

public interface CoinTransactionDao {

	CoinTransaction getCointTransactionById(int id);
	CoinTransaction getCoinTransactionForGoal(int id);

	CoinTransaction addCoinTransaction(CoinTransaction coinTransaction);
	CoinTransaction updateCoinTransaction(CoinTransaction coinTransaction);

}
