package gameIt.registration.dao;

import java.util.List;

import gameIt.registration.models.User;
import gameIt.registration.models.UserEntity;

public interface UserDao {

	UserEntity getUserById(int id);
	UserEntity getUserByUserName(String username);
	    List<UserEntity> getAllUsers();
	    UserEntity addUser(UserEntity userEntity);
	    void updateUser(UserEntity userEntity);
	    void deleteUserById(int id);
	    List<UserEntity> getAllUsersForStudent();
		int getLastUserId();
		void updateResetPasswordToken(String token, String email);
		UserEntity getByResetPasswordToken(String token);
		void updatePassword(UserEntity userEntity, String password);
		UserEntity getUserForStudent(int id);
		
		void deleteConfirmRegisterToken(int id);
		UserEntity addUserGuardian(UserEntity userEntity);
		
		void updateUserCoins(int id, int AmountOfcoins);

	
	
}
