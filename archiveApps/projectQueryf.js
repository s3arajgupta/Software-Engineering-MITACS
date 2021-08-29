function PQ(creationDate, _cursor) {
  if (_cursor != "") cursor = `, after:"${_cursor}"`;
  else cursor = "";
  creationQuery = `${creationDate}`
  return `
{
  rateLimit {
    limit
    cost
    remaining
    used
    resetAt
    nodeCount
  }
  search(first: 20 ${cursor}, query: "created:2020-01-01..2020-12-31 augmented reality stars:>=1", type: REPOSITORY) {
    pageInfo {
      endCursor
      hasNextPage
    }
    repositoryCount
    userCount
    wikiCount
    edges {
      cursor
      node {
        ... on Repository {
          name
          nameWithOwner
          id
          assignableUsers {
            totalCount
          }
          createdAt
          databaseId
          description
          diskUsage
          environments(first: 5) {
            edges {
              node {
                name
              }
            }
            totalCount
          }
          forkCount
          hasIssuesEnabled
          hasProjectsEnabled
          hasWikiEnabled
          isArchived
          isBlankIssuesEnabled
          isDisabled
          isEmpty
          isFork
          isInOrganization
          isLocked
          isMirror
          isPrivate
          isSecurityPolicyEnabled
          isTemplate
          isUserConfigurationRepository
          issues {
            totalCount
          }
          labels {
            totalCount
          }
          languages(first: 20) {
            edges {
              node {
                name
              }
            }
            totalCount
          }
          lockReason
          mergeCommitAllowed
          mirrorUrl
          primaryLanguage {
            name
          }
          projects {
            totalCount
          }
          rebaseMergeAllowed
          repositoryTopics(first: 20) {
            edges {
              node {
                topic {
                  name
                  relatedTopics(first: 10) {
                    name
                  }
                  stargazerCount
                }
              }
            }
            totalCount
          }
          stargazerCount
          submodules(first: 10) {
            edges {
              node {
                name
              }
            }
            totalCount
          }
          tempCloneToken
          url
          usesCustomOpenGraphImage
          viewerCanAdminister
          viewerCanCreateProjects
          viewerCanSubscribe
          viewerCanUpdateTopics
          viewerDefaultCommitEmail
          viewerDefaultMergeMethod
          viewerHasStarred
          viewerPermission
          viewerPossibleCommitEmails
          viewerSubscription
          watchers {
            totalCount
          }
        }
      }
      textMatches {
        fragment
        property
      }
    }
  }
}
`
}

module.exports = PQ;