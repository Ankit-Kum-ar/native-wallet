import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, router } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '../../components/SignOutButton'
import { useTransactions } from '../../hooks/useTransactions'
import { useEffect } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { BalanceCard } from '../../components/BalanceCard'

export default function Page() {
  const { user } = useUser()
  const user_id = user?.id
  // console.log('User:', user.id)
  const { transactions, summary, loading, loadData, deleteTransaction } = useTransactions(user_id)

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Left */}
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split('@')[0] || 'User'} 
              </Text>
            </View>
          </View>

          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>  
        </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transaction</Text>
        </View>
         
      </View>
    </View>
  )
}