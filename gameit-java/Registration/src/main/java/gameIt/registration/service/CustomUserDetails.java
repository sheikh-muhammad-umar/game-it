package gameIt.registration.service;


import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import gameIt.registration.models.UserEntity;

public class CustomUserDetails implements UserDetails  {
	
	private UserEntity user;
	
	
	public CustomUserDetails(UserEntity user) {
        this.user = user;
    }

	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getPassword() {
        return user.getPassword();
	}

	@Override
	public String getUsername() {
        return user.getUserName();
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		// return true;
		return user.isEnabled();
	}
	
	  public String getFullName() {
	        return user.getFirstName() + " " + user.getLastName();
	    }
	 
	  public long getUserId() {
	        return user.getUserid();
	    }

		public String getEmailId() {
			return user.getEmailId();
		}
	}
