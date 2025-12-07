import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import { getUserHabits, createHabit, completeHabit, uncompleteHabit, deleteHabit, editHabit, getUserStats } from '../services/habits';
import Navbar from './Navbar';
import ProfileSection from './ProfileSection';
import MonthlyCalendar from './MonthlyCalendar';
import StatsButtons from './StatsButtons';
import ProgressBar from './ProgressBar';
import StreakDisplay from './StreakDisplay';
import HabitForm from './HabitForm';
import HabitList from './HabitList';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [completedHabitIds, setCompletedHabitIds] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily',
    category: 'easy'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      loadData(currentUser.id);
    }
  }, [navigate]);

  const loadData = async (userId) => {
    try {
      const [habitsData, statsData] = await Promise.all([
        getUserHabits(userId),
        getUserStats(userId)
      ]);
      setHabits(habitsData.habits);
      setStats(statsData);
      
      // Get today's completed habit IDs
      const today = new Date().toISOString().split('T')[0];
      const completedIds = []; // Will be populated from habit logs
      setCompletedHabitIds(completedIds);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      await createHabit(user.id, formData.name, formData.frequency, formData.category);
      setMessage('Habit created successfully! 🎉');
      setFormData({ name: '', frequency: 'daily', category: 'easy' });
      setShowCreateForm(false);
      loadData(user.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to create habit');
    }
  };

  const handleEditHabit = async (e) => {
    e.preventDefault();
    try {
      await editHabit(editingHabit.id, formData.name, formData.frequency, formData.category, editingHabit.active);
      setMessage('Habit updated successfully! ✨');
      setEditingHabit(null);
      setFormData({ name: '', frequency: 'daily', category: 'easy' });
      loadData(user.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update habit');
    }
  };

  const handleCompleteHabit = async (habitId) => {
    // Check if already completed
    if (completedHabitIds.includes(habitId)) {
      setMessage('⚠️ This habit is already completed today!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const result = await completeHabit(habitId, user.id);
      setMessage(`+${result.xpEarned} XP! 🌟`);
      
      // Update user and stats
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      setCompletedHabitIds([...completedHabitIds, habitId]);
      
      // Reload stats
      loadData(user.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to complete habit';
      setMessage(`⚠️ ${errorMsg}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUncompleteHabit = async (habitId) => {
    try {
      const result = await uncompleteHabit(habitId, user.id);
      setMessage(`-${result.xpDeducted} XP`);
      
      // Update user and stats
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      setCompletedHabitIds(completedHabitIds.filter(id => id !== habitId));
      
      // Reload stats
      loadData(user.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to uncomplete habit';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Delete this habit?')) {
      try {
        await deleteHabit(habitId);
        setMessage('Habit deleted');
        loadData(user.id);
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Failed to delete habit');
      }
    }
  };

  const startEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      frequency: habit.frequency,
      category: habit.category
    });
    setShowCreateForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      background: 'linear-gradient(135deg, #F5D3C4 0%, #E8D4B7 100%)' 
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Navbar */}
        <Navbar onLogout={handleLogout} />

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '20px'
        }}>
          {/* LEFT SIDEBAR */}
          <div>
            <ProfileSection user={user} stats={stats} />
            <MonthlyCalendar userId={user.id} />
            <StatsButtons />
          </div>

          {/* RIGHT SECTION */}
          <div>
            {message && (
              <div className={message.includes('XP') || message.includes('🎉') ? 'success-message' : 'error-message'} 
                   style={{ marginBottom: '20px' }}>
                {message}
              </div>
            )}

            {stats && (
              <>
                <ProgressBar 
                  currentXp={stats.xp} 
                  nextLevelXp={stats.nextLevelXp} 
                  level={stats.level} 
                />
                <StreakDisplay 
                  streak={stats.streak} 
                  allCompletedToday={stats.allCompletedToday} 
                />
              </>
            )}

            {(showCreateForm || editingHabit) && (
              <HabitForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={editingHabit ? handleEditHabit : handleCreateHabit}
                onCancel={() => {
                  setShowCreateForm(false);
                  setEditingHabit(null);
                  setFormData({ name: '', frequency: 'daily', category: 'easy' });
                }}
                isEditing={!!editingHabit}
              />
            )}

            {!showCreateForm && !editingHabit && (
              <button 
                onClick={() => setShowCreateForm(true)} 
                className="btn-primary"
                style={{ marginBottom: '20px', width: '100%' }}
              >
                + NEW HABIT
              </button>
            )}

            <HabitList
              habits={habits}
              completedHabitIds={completedHabitIds}
              onComplete={handleCompleteHabit}
              onUncomplete={handleUncompleteHabit}
              onEdit={startEdit}
              onDelete={handleDeleteHabit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
