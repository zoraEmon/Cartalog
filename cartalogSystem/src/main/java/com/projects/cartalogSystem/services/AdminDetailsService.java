package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.APIs.AdminRepository;
import com.projects.cartalogSystem.entities.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AdminDetailsService implements UserDetailsService {
    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Admin> admin = adminRepository.findByUsername(username);
        Admin adminDetails = admin.orElseThrow(() -> new UsernameNotFoundException("Admin not found with username: " + username));
        return new User(adminDetails.getUsername(), adminDetails.getPassword(), new ArrayList<>());
    }
}
