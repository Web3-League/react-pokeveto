import React, { useState } from 'react';
import { CustomGrid } from '../custom/CustomGrid';
import CustomBox from '../custom/CustomBox';
import CustomHeader from '../custom/CustomHeader';
import CustomFooter from '../custom/CustomFooter';
import { useAuthenticatedPage } from '../hooks/useAuthenticatedPage';
import Login from '../auth/login';
import CustomRace from '../custom/CustomRace';
import CustomTraitement from '../custom/CustomTraitement';
import CustomAntiTique from '../custom/CustomAntiTique';
import CustomAntiPuce from '../custom/CustomAntiPuce';
import CustomAntiVirus from '../custom/CustomAntiVirus';
import CustomAntiBacterie from '../custom/CustomAntiBacterie';
import useToken from '../hooks/useToken';
import CustomAnimalName from '../custom/CustomAnimalName';
import './styles/homepage.css';

const HomePage: React.FC = () => {
  const { isAuthenticated, loading } = useAuthenticatedPage();
  const [selectedRace, setSelectedRace] = useState<string>('');
  const [selectedAnimalName, setSelectedAnimalName] = useState<string>('');
  const { userId, userRoles } = useToken();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Passing a dummy handleLogin function for now
    return <Login handleLogin={async () => { }} />;
  }

  return (
    <CustomGrid>
      <CustomBox gridColumn="1 / span 12" gridRow="1 / span 2">
        <CustomHeader userId={userId ?? ''} selectedAnimalName={selectedAnimalName} selectedRace={selectedRace} isAdmin={userRoles?.includes('ROLE_ADMIN') ?? false} />
      </CustomBox>
      <CustomBox gridColumn="1 / span 12" gridRow="3 / span 2">
        <CustomGrid>
          <CustomBox gridColumn=" 1" gridRow="1 / span 2">
            <CustomRace selectedRace={selectedRace} setSelectedRace={setSelectedRace} userId={userId ?? ''} />
          </CustomBox>
          <CustomBox gridColumn=" 2" gridRow="1 / span 2 " >
            <CustomAnimalName selectedRace={selectedRace} selectedAnimalName={selectedAnimalName} setSelectedAnimalName={setSelectedAnimalName} />
          </CustomBox>
        </CustomGrid>
      </CustomBox>
      <CustomBox gridColumn="1/ span 12" gridRow="5 / span 2">
        <CustomBox gridColumn="12" gridRow="1">
          <CustomTraitement userId={userId ?? ''} selectedAnimalName={selectedAnimalName} />
        </CustomBox>
      </CustomBox>
      <CustomBox gridColumn="1 / span 12" gridRow="7 / span 2">
        <CustomGrid>
          <CustomBox gridColumn="1" gridRow="1 / span 2">
            <CustomAntiTique userId={userId ?? ''} selectedAnimalName={selectedAnimalName} />
          </CustomBox>
          <CustomBox gridColumn="2" gridRow="1 / span 2">
            <CustomAntiPuce selectedRace={selectedRace} userId={userId ?? ''} selectedAnimalName={selectedAnimalName} />
          </CustomBox>
        </CustomGrid>
      </CustomBox>
      <CustomBox gridColumn="1 / span 12" gridRow="9 / span 2">
        <CustomGrid>
          <CustomBox gridColumn="1" gridRow="1 / span 2">
            <CustomAntiVirus userId={userId ?? ''} selectedAnimalName={selectedAnimalName} />
          </CustomBox>
          <CustomBox gridColumn="2" gridRow="1 / span 2">
            <CustomAntiBacterie userId={userId ?? ''} selectedAnimalName={selectedAnimalName} />
          </CustomBox>
        </CustomGrid>
      </CustomBox>
      <CustomBox gridColumn="1 / span 12" gridRow="11 / span 2">
        <CustomFooter />
      </CustomBox>
    </CustomGrid>
  );
};

export default HomePage;

