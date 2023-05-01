package gameIt.registration.models;

import java.util.Date;

public class CoinTransaction {

	private int id;
	private int fromUserId;
	private int toUserId;
	private int amountOfCoins;
	private String status;
	private Date transactionDate;
	private String reason;
	
	
	public CoinTransaction() 	{
		transactionDate = new Date();	
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getFromUserId() {
		return fromUserId;
	}
	public void setFromUserId(int fromUserId) {
		this.fromUserId = fromUserId;
	}
	public int getToUserId() {
		return toUserId;
	}
	public void setToUserId(int toUserId) {
		this.toUserId = toUserId;
	}
	public int getAmountOfCoins() {
		return amountOfCoins;
	}
	public void setAmountOfCoins(int amountOfCoins) {
		this.amountOfCoins = amountOfCoins;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Date getTransactionDate() {
		return transactionDate;
	}
	public void setTransactionDate(Date transactionDate) {
		this.transactionDate = transactionDate;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}


}
