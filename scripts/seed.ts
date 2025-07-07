#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { createClerkClient } from '@clerk/backend'

// Load environment variables
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local for development
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const clerkSecretKey = process.env.CLERK_SECRET_KEY

if (!supabaseUrl || !supabaseServiceKey || !clerkSecretKey) {
  console.error('❌ Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  console.error('CLERK_SECRET_KEY:', !!clerkSecretKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const clerkClient = createClerkClient({ secretKey: clerkSecretKey })

const TEST_USERS = [
  {
    email: 'patrob+mymcp+free@gmail.com',
    firstName: 'Pat',
    lastName: 'Robinson (Free)',
    password: 'TestPassword123!',
    plan: 'free' as const,
    maxServers: 0,
  },
  {
    email: 'patrob+mymcp+dev@gmail.com',
    firstName: 'Pat',
    lastName: 'Robinson (Dev)',
    password: 'TestPassword123!',
    plan: 'dev' as const,
    maxServers: 1,
    stripeCustomerId: 'cus_dev_test_customer',
    stripeSubscriptionId: 'sub_dev_test_subscription',
  },
  {
    email: 'patrob+mymcp+pro@gmail.com',
    firstName: 'Pat',
    lastName: 'Robinson (Pro)',
    password: 'TestPassword123!',
    plan: 'pro' as const,
    maxServers: 3,
    stripeCustomerId: 'cus_pro_test_customer',
    stripeSubscriptionId: 'sub_pro_test_subscription',
  },
  {
    email: 'patrob+mymcp+team@gmail.com',
    firstName: 'Pat',
    lastName: 'Robinson (Team)',
    password: 'TestPassword123!',
    plan: 'team' as const,
    maxServers: -1,
    stripeCustomerId: 'cus_team_test_customer',
    stripeSubscriptionId: 'sub_team_test_subscription',
  },
]

// Server templates - will be created with actual user IDs after Clerk users are processed
const SERVER_TEMPLATES = [
  // Dev user gets 1 server
  {
    plan: 'dev' as const,
    servers: [
      {
        name: 'GitHub Integration',
        sourceType: 'github_repo' as const,
        sourceUrl: 'https://github.com/modelcontextprotocol/servers',
        status: 'active' as const,
        config: {
          repository: {
            name: 'servers',
            fullName: 'modelcontextprotocol/servers',
            url: 'https://github.com/modelcontextprotocol/servers',
            description: 'Official MCP servers collection',
            license: 'MIT',
            hasManifest: true,
          },
        },
      },
    ],
  },
  // Pro user gets 3 servers with different statuses
  {
    plan: 'pro' as const,
    servers: [
      {
        name: 'Web Search MCP',
        sourceType: 'github_repo' as const,
        sourceUrl: 'https://github.com/example/web-search-mcp',
        status: 'active' as const,
        config: {
          repository: {
            name: 'web-search-mcp',
            fullName: 'example/web-search-mcp',
            url: 'https://github.com/example/web-search-mcp',
            description: 'Web search capabilities for AI agents',
            license: 'Apache-2.0',
            hasManifest: true,
          },
        },
      },
      {
        name: 'Database MCP',
        sourceType: 'github_repo' as const,
        sourceUrl: 'https://github.com/example/database-mcp',
        status: 'inactive' as const,
        config: {
          repository: {
            name: 'database-mcp',
            fullName: 'example/database-mcp',
            url: 'https://github.com/example/database-mcp',
            description: 'Database operations for AI agents',
            license: 'MIT',
            hasManifest: true,
          },
        },
      },
      {
        name: 'Email MCP (Broken)',
        sourceType: 'github_repo' as const,
        sourceUrl: 'https://github.com/example/broken-email-mcp',
        status: 'error' as const,
        config: {
          repository: {
            name: 'broken-email-mcp',
            fullName: 'example/broken-email-mcp',
            url: 'https://github.com/example/broken-email-mcp',
            description: 'Email operations (currently failing)',
            license: 'MIT',
            hasManifest: false,
          },
        },
      },
    ],
  },
  // Team user gets multiple servers
  {
    plan: 'team' as const,
    servers: [
      {
        name: 'Slack Integration',
        sourceType: 'github_repo' as const,
        sourceUrl: 'https://github.com/example/slack-mcp',
        status: 'active' as const,
        config: {
          repository: {
            name: 'slack-mcp',
            fullName: 'example/slack-mcp',
            url: 'https://github.com/example/slack-mcp',
            description: 'Slack workspace integration',
            license: 'MIT',
            hasManifest: true,
          },
        },
      },
      {
        name: 'Notion MCP',
        sourceType: 'github_repo' as const,
        sourceUrl: 'https://github.com/example/notion-mcp',
        status: 'active' as const,
        config: {
          repository: {
            name: 'notion-mcp',
            fullName: 'example/notion-mcp',
            url: 'https://github.com/example/notion-mcp',
            description: 'Notion workspace integration',
            license: 'Apache-2.0',
            hasManifest: true,
          },
        },
      },
      {
        name: 'Custom Analytics',
        sourceType: 'github_repo' as const,
        sourceUrl: 'https://github.com/example/analytics-mcp',
        status: 'active' as const,
        config: {
          repository: {
            name: 'analytics-mcp',
            fullName: 'example/analytics-mcp',
            url: 'https://github.com/example/analytics-mcp',
            description: 'Custom analytics and reporting',
            license: 'MIT',
            hasManifest: true,
          },
        },
      },
      {
        name: 'File Processing',
        sourceType: 'github_repo' as const,
        sourceUrl: 'https://github.com/example/file-processing-mcp',
        status: 'inactive' as const,
        config: {
          repository: {
            name: 'file-processing-mcp',
            fullName: 'example/file-processing-mcp',
            url: 'https://github.com/example/file-processing-mcp',
            description: 'Advanced file processing capabilities',
            license: 'GPL-3.0',
            hasManifest: true,
          },
        },
      },
    ],
  },
]

// Type for processed users with Clerk IDs
interface ProcessedUser {
  clerkId: string
  email: string
  firstName: string
  lastName: string
  plan: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

async function findExistingClerkUsers(): Promise<Map<string, any>> {
  console.log('🔍 Checking for existing Clerk users...')
  const existingUsers = new Map()
  
  for (const user of TEST_USERS) {
    try {
      // Search for user by email address
      const users = await clerkClient.users.getUserList({
        emailAddress: [user.email]
      })
      
      if (users.data.length > 0) {
        const existingUser = users.data[0]
        existingUsers.set(user.email, existingUser)
        console.log(`  ✅ Found existing: ${user.email} (${existingUser.id})`)
      } else {
        console.log(`  🆕 Missing: ${user.email}`)
      }
    } catch (error) {
      console.error(`  ❌ Error checking ${user.email}:`, error)
    }
    
    // Rate limiting: wait 100ms between requests to avoid hitting limits
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return existingUsers
}

async function createMissingClerkUsers(existingUsers: Map<string, any>): Promise<ProcessedUser[]> {
  console.log('\n👥 Creating missing Clerk users...')
  const processedUsers: ProcessedUser[] = []
  
  for (const user of TEST_USERS) {
    let clerkUser
    
    if (existingUsers.has(user.email)) {
      // Use existing user
      clerkUser = existingUsers.get(user.email)
      console.log(`  ✅ Using existing: ${user.email} (${clerkUser.id})`)
    } else {
      // Create new user
      try {
        clerkUser = await clerkClient.users.createUser({
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: [user.email],
          password: user.password,
        })
        console.log(`  ✅ Created: ${user.email} (${clerkUser.id})`)
      } catch (error) {
        console.error(`  ❌ Failed to create ${user.email}:`, error)
        continue
      }
    }
    
    // Add to processed users list
    processedUsers.push({
      clerkId: clerkUser.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      plan: user.plan,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
    })
    
    // Rate limiting: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return processedUsers
}

async function syncUsersToDatabase(processedUsers: ProcessedUser[]) {
  console.log('\n💾 Syncing users to database...')
  
  for (const user of processedUsers) {
    try {
      // Create or update user in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.clerkId)
        .single()
      
      if (existingUser) {
        // Update existing user
        await supabase
          .from('users')
          .update({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          })
          .eq('id', user.clerkId)
        console.log(`  ✅ Updated database user: ${user.email}`)
      } else {
        // Create new user
        await supabase
          .from('users')
          .insert([{
            id: user.clerkId,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          }])
        console.log(`  ✅ Created database user: ${user.email}`)
      }
      
      // Create or update subscription
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.clerkId)
        .single()
      
      if (existingSub) {
        // Update existing subscription
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            plan_id: user.plan,
          })
          .eq('user_id', user.clerkId)
        console.log(`  ✅ Updated subscription: ${user.plan} tier`)
      } else {
        // Create new subscription
        await supabase
          .from('subscriptions')
          .insert([{
            user_id: user.clerkId,
            stripe_customer_id: user.stripeCustomerId || '',
            stripe_subscription_id: user.stripeSubscriptionId || '',
            status: 'active',
            plan_id: user.plan,
          }])
        console.log(`  ✅ Created subscription: ${user.plan} tier`)
      }
      
    } catch (error) {
      console.error(`  ❌ Failed to sync ${user.email}:`, error)
    }
  }
}

async function createSampleServers(processedUsers: ProcessedUser[]) {
  console.log('\n🖥️ Creating sample MCP servers...')
  
  for (const user of processedUsers) {
    // Find server templates for this user's plan
    const template = SERVER_TEMPLATES.find(t => t.plan === user.plan)
    if (!template || template.servers.length === 0) {
      continue // Free tier has no custom servers
    }
    
    for (const serverTemplate of template.servers) {
      try {
        // Check if server already exists
        const { data: existingServer } = await supabase
          .from('mcp_servers')
          .select('*')
          .eq('user_id', user.clerkId)
          .eq('name', serverTemplate.name)
          .single()
        
        if (existingServer) {
          console.log(`  ⏭️ Server already exists: ${serverTemplate.name}`)
          continue
        }
        
        // Create new server
        await supabase
          .from('mcp_servers')
          .insert([{
            user_id: user.clerkId,
            name: serverTemplate.name,
            source_type: serverTemplate.sourceType,
            source_url: serverTemplate.sourceUrl,
            config: serverTemplate.config,
            status: serverTemplate.status,
          }])
        
        console.log(`  ✅ Created server: ${serverTemplate.name} (${serverTemplate.status}) for ${user.plan}`)
      } catch (error) {
        console.error(`  ❌ Failed to create server ${serverTemplate.name}:`, error)
      }
    }
  }
}

async function deleteClerkTestUsers() {
  console.log('🗑️ Deleting existing Clerk test users...')
  
  for (const user of TEST_USERS) {
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [user.email]
      })
      
      for (const existingUser of users.data) {
        await clerkClient.users.deleteUser(existingUser.id)
        console.log(`  ✅ Deleted Clerk user: ${user.email} (${existingUser.id})`)
      }
    } catch (error) {
      console.error(`  ❌ Error deleting ${user.email}:`, error)
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

async function clearDatabase() {
  console.log('🧹 Clearing existing database test data...')
  
  // Get all test user IDs (both old format and Clerk format)
  const { data: testUsers } = await supabase
    .from('users')
    .select('id')
    .or('id.like.user_%_test,email.like.%+mymcp+%@gmail.com')
  
  if (testUsers && testUsers.length > 0) {
    const userIds = testUsers.map(u => u.id)
    
    // Delete in order due to foreign key constraints
    await supabase.from('mcp_servers').delete().in('user_id', userIds)
    await supabase.from('subscriptions').delete().in('user_id', userIds)
    await supabase.from('users').delete().in('id', userIds)
    
    console.log(`✅ Cleared ${userIds.length} test users from database`)
  } else {
    console.log('✅ No test data found in database')
  }
}

async function verifySetup(processedUsers: ProcessedUser[]) {
  console.log('\n🔍 Verifying complete setup...')
  
  let clerkCount = 0
  let dbUserCount = 0
  let subscriptionCount = 0
  let serverCount = 0
  
  // Verify Clerk users
  for (const user of processedUsers) {
    try {
      await clerkClient.users.getUser(user.clerkId)
      clerkCount++
    } catch (error) {
      console.error(`❌ Clerk user missing: ${user.email}`)
    }
  }
  
  // Verify database records
  const { data: dbUsers } = await supabase
    .from('users')
    .select('*')
    .in('id', processedUsers.map(u => u.clerkId))
  
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .in('user_id', processedUsers.map(u => u.clerkId))
  
  const { data: servers } = await supabase
    .from('mcp_servers')
    .select('*')
    .in('user_id', processedUsers.map(u => u.clerkId))
  
  dbUserCount = dbUsers?.length || 0
  subscriptionCount = subscriptions?.length || 0
  serverCount = servers?.length || 0
  
  console.log(`✅ Verification complete:`)
  console.log(`   📊 ${clerkCount}/${processedUsers.length} Clerk users`)
  console.log(`   📊 ${dbUserCount}/${processedUsers.length} database users`)
  console.log(`   📊 ${subscriptionCount}/${processedUsers.length} subscriptions`)
  console.log(`   📊 ${serverCount} sample servers`)
  
  // Show user details
  console.log('\n👥 Test Users Ready:')
  for (const user of processedUsers) {
    const sub = subscriptions?.find(s => s.user_id === user.clerkId)
    const userServers = servers?.filter(s => s.user_id === user.clerkId) || []
    console.log(`   ${user.email} (${sub?.plan_id || 'unknown'}) - ID: ${user.clerkId} - ${userServers.length} servers`)
  }
}

async function main() {
  const shouldReset = process.argv.includes('--reset')
  
  console.log('🌱 Starting complete user setup with Clerk integration...')
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Supabase URL: ${supabaseUrl}`)
  console.log(`👤 Clerk Secret: ${clerkSecretKey ? '✅ Configured' : '❌ Missing'}`)
  
  try {
    let processedUsers: ProcessedUser[]
    
    if (shouldReset) {
      await deleteClerkTestUsers()
      await clearDatabase()
      
      // Create fresh users
      const existingUsers = new Map() // Empty map for fresh start
      processedUsers = await createMissingClerkUsers(existingUsers)
    } else {
      // Check existing and create missing
      const existingUsers = await findExistingClerkUsers()
      processedUsers = await createMissingClerkUsers(existingUsers)
    }
    
    await syncUsersToDatabase(processedUsers)
    await createSampleServers(processedUsers)
    await verifySetup(processedUsers)
    
    console.log('\n🎉 Complete setup finished successfully!')
    console.log('\n📝 You can now test with these credentials:')
    console.log('   Password for all users: TestPassword123!')
    console.log('\n📧 Test user emails:')
    processedUsers.forEach(user => {
      console.log(`   • ${user.email} (${user.plan} tier)`)
    })
    
    console.log('\n🚀 Next steps:')
    console.log('   1. Run: npm run dev')
    console.log('   2. Sign in with any test email above')
    console.log('   3. Test the dashboard and features!')
    
  } catch (error) {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}