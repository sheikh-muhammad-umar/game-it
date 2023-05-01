package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

import gameIt.registration.models.User;
import gameIt.registration.models.UserEntity;
import gameIt.registration.service.UserRepository;

@Service
@Transactional
@Repository
public class UserDaoDB implements UserDao {

	@Autowired
	JdbcTemplate jdbc;

	@Autowired
	private UserRepository userRepo;

	@Override
	public UserEntity getUserById(int id) {
		try {
			final String GET_USER_BY_ID = "SELECT * FROM user WHERE userid = ?";
			return jdbc.queryForObject(GET_USER_BY_ID, new UserMapper(), id);
		} catch (DataAccessException ex) {
			return null;
		}
	}

	@Override
	public List<UserEntity> getAllUsers() {
		final String GET_ALL_USERS = "SELECT * FROM user";
		return jdbc.query(GET_ALL_USERS, new UserMapper());
	}

	@Override
	@Transactional
	public UserEntity addUser(UserEntity userEntity) {
		final String INSERT_USER = "INSERT INTO user(username, first_name, last_name, password_hash, user_type, is_enabled) "
				+ "VALUES(?,?,?,?,?,?)";
		jdbc.update(INSERT_USER, userEntity.getUserName(), userEntity.getFirstName(), userEntity.getLastName(),
				userEntity.getPassword(), userEntity.getUserType(), userEntity.isEnabled());

		int newId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
		userEntity.setUserid(newId);

		return userEntity;
	}

	@Override
	@Transactional
	public UserEntity addUserGuardian(UserEntity userEntity) {
		final String INSERT_USER = "INSERT INTO user(username, first_name, last_name, password_hash, user_type, email, is_enabled) "
				+ "VALUES(?,?,?,?,?,?,?)";
		jdbc.update(INSERT_USER, userEntity.getUserName(), userEntity.getFirstName(), userEntity.getLastName(),
				userEntity.getPassword(), userEntity.getUserType(), userEntity.getEmailId(), userEntity.isEnabled());

		int newId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
		userEntity.setUserid(newId);

		return userEntity;
	}

	@Override
	public void updateUser(UserEntity userEntity) {
		final String UPDATE_USER = "UPDATE user SET username = ?, first_name = ?, last_name = ?, is_enabled= ?, Deleted = ? WHERE userid = ?";
		jdbc.update(UPDATE_USER, userEntity.getUserName(), userEntity.getFirstName(), userEntity.getLastName(),
				userEntity.isEnabled(), userEntity.getDeleted(), userEntity.getUserid());
	}

	@Override
	@Transactional
	public void deleteUserById(int id) {

//		final String DELETE_STUDENT = "DELETE s.* FROM student s"
//				+ "JOIN guardiantostudent sg ON s.StudentID = sg.StudentID "
//				+ "JOIN guardian g ON sg.GuardianID = g.GuardianID WHERE g.GuardianID = ?";
//		jdbc.update(DELETE_STUDENT, id);
//		
//		final String DELETE_STUDENT_GUARDIAN = "DELETE sg.* FROM guardiantostudent sg "
//				+ "JOIN guardian g ON sg.GuardianID = g.GuardianID WHERE g.GuardianID = ?";
//		jdbc.update(DELETE_STUDENT_GUARDIAN, id);
//
//		final String DELETE_GUARDIAN = "DELETE FROM guardian WHERE GuardianID = ?";
//		jdbc.update(DELETE_GUARDIAN, id);
//		
//		final String DELETE_CONFIRMATION_TOKEN = "DELETE FROM confirmation_token WHERE user_id = ?";
//		jdbc.update(DELETE_CONFIRMATION_TOKEN, id);
//
//		final String DELETE_USER = "DELETE FROM user WHERE userid = ?";
//		jdbc.update(DELETE_USER, id);
	}

	@Override
	public UserEntity getUserByUserName(String username) {
		try {
			final String GET_USER_BY_USERNAME = "SELECT * FROM user WHERE username = ?";
			return jdbc.queryForObject(GET_USER_BY_USERNAME, new UserMapper(), username);
		} catch (DataAccessException ex) {
			return null;
		}
	}

	@Override
	public UserEntity getUserForStudent(int id) {
		try {
			final String GET_USER_FOR_STUDENT = "SELECT * FROM user "
					+ "JOIN student ON user.userid = student.StudentID WHERE StudentID = ?";
			return jdbc.queryForObject(GET_USER_FOR_STUDENT, new UserMapper(), id);
		} catch (DataAccessException ex) {
			return null;
		}
	}

	@Override
	public int getLastUserId() {
		int newId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
		return newId;
	}

	public void updateResetPasswordToken(String token, String email) throws EntityNotFoundException {
		UserEntity userEntity = userRepo.findByEmailIdIgnoreCase(email);
		if (userEntity != null) {
			userEntity.setResetPasswordToken(token);
			userRepo.save(userEntity);
		} else {
			throw new EntityNotFoundException("Could not find any user with the email " + email);
		}
	}

	public UserEntity getByResetPasswordToken(String token) {
		return userRepo.findByResetPasswordToken(token);
	}

	public void updatePassword(UserEntity userEntity, String newPassword) {
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String encodedPassword = passwordEncoder.encode(newPassword);
		userEntity.setPassword(encodedPassword);

		userEntity.setResetPasswordToken(null);
		userRepo.save(userEntity);
	}

	@Override
	public List<UserEntity> getAllUsersForStudent() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteConfirmRegisterToken(int id) {
		final String DELETE_CONFIRM_TOKEN = "DELETE FROM confirmation_token WHERE user_id = ?";
		jdbc.update(DELETE_CONFIRM_TOKEN, id);
	}

	@Override
	public void updateUserCoins(int id, int AmountOfcoins) {
		final String UPDATE_USER_COINS = "UPDATE user SET coin = ? WHERE userid = ?";
		jdbc.update(UPDATE_USER_COINS, AmountOfcoins, id);
	}

	public static final class UserMapper implements RowMapper<UserEntity> {

		@Override
		public UserEntity mapRow(ResultSet rs, int index) throws SQLException {
			UserEntity userEntity = new UserEntity();
			userEntity.setUserid(rs.getInt("userid"));
			userEntity.setUserName(rs.getString("username"));
			userEntity.setFirstName(rs.getString("first_name"));
			userEntity.setLastName(rs.getString("last_name"));
			userEntity.setUserType(rs.getString("user_type"));
			userEntity.setCoin(rs.getInt("coin"));
			userEntity.setDeleted(rs.getBoolean("Deleted"));
			userEntity.setEnabled(rs.getBoolean("is_enabled"));

			return userEntity;
		}
	}
}