package gameIt.registration.models;

import java.util.Objects;

public class Guardian {
	
	private int id;
    private int phoneNo;
    private String paymentInfo;
    
    
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getPhoneNo() {
		return phoneNo;
	}
	public void setPhoneNo(int phoneNo) {
		this.phoneNo = phoneNo;
	}
	public String getPaymentInfo() {
		return paymentInfo;
	}
	public void setPaymentInfo(String paymentInfo) {
		this.paymentInfo = paymentInfo;
	}
	
	
	@Override
	public int hashCode() {
		return Objects.hash(id, paymentInfo, phoneNo);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Guardian other = (Guardian) obj;
		return id == other.id && Objects.equals(paymentInfo, other.paymentInfo) && phoneNo == other.phoneNo;
	}
    
    
    
}
