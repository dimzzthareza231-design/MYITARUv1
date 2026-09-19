const fs = require('fs');
let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Inside onAuthStateChanged, modify the isGoogle condition:
content = content.replace(
  /roleId: isGoogle \? 'viewer' : \(data\.roleId \|\| 'admin'\),/,
  `roleId: (isGoogle && fUser.email === 'dimzzthareza231@gmail.com') ? 'super_admin' : (isGoogle ? 'viewer' : (data.roleId || 'admin')),`
);

content = content.replace(
  /roleId: isGoogle \? 'viewer' : 'super_admin',/,
  `roleId: (isGoogle && fUser.email === 'dimzzthareza231@gmail.com') ? 'super_admin' : (isGoogle ? 'viewer' : 'super_admin'),`
);

// Inside signInWithGoogle, add email validation
const validationCode = `
      const fUser = result.user;
      
      // Restrict access exclusively to the owner
      if (fUser.email !== 'dimzzthareza231@gmail.com') {
        await firebaseSignOut(auth);
        await clearAuthSession();
        return { success: false, message: 'Akses ditolak. Sistem terkunci hanya untuk Pemilik Proyek (dimzzthareza231@gmail.com).' };
      }
`;

content = content.replace(
  /const fUser = result\.user;/,
  validationCode.trim()
);

// Overwrite roleId logic in signInWithGoogle
content = content.replace(
  /let roleId = 'viewer';/,
  `let roleId = fUser.email === 'dimzzthareza231@gmail.com' ? 'super_admin' : 'viewer';`
);

content = content.replace(
  /roleId: 'viewer',/g,
  `roleId: fUser.email === 'dimzzthareza231@gmail.com' ? 'super_admin' : 'viewer',`
);

// We need to also make sure that read only check respects super_admin
content = content.replace(
  /const isReadOnly = currentUser\?\.roleId === 'viewer' \|\| currentUser\?\.isGoogleAuth === true;/,
  `const isReadOnly = currentUser?.roleId === 'viewer' || (currentUser?.isGoogleAuth === true && currentUser?.roleId !== 'super_admin');`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
console.log('AuthContext patched for owner restriction.');
