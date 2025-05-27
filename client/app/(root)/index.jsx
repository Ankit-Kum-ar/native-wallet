import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SignOutButton } from '../../components/SignOutButton'
import { useTransactions } from '../../hooks/useTransactions'
import { useEffect } from 'react'

export default function Page() {
  const { user } = useUser()
  const user_id = user?.id
  // console.log('User:', user.id)
  const { transactions, summary, loading, loadData, deleteTransaction } = useTransactions(user_id)

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log('Transactions:', transactions)
  console.log('Summary:', summary)


  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}