"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function CommentSection({
  artworkId,
}: {
  artworkId: string
}) {

  const [user, setUser] = useState<any>(null)

  const [comments, setComments] = useState<any[]>([])

  const [newComment, setNewComment] =
    useState("")

  const [showComments, setShowComments] =
    useState(false)

  // INITIAL COMMENTS
  const [baseComments, setBaseComments] =
    useState(0)

  // REAL COMMENTS
  const [realCommentsCount, setRealCommentsCount] =
    useState(0)

  useEffect(() => {

    fetchData()

  }, [])

  const fetchData = async () => {

    const { data: userData } =
      await supabase.auth.getUser()

    setUser(userData.user)

    // 🔥 FETCH INITIAL COMMENT COUNT
    const { data: stats } = await supabase
      .from("artwork_stats")
      .select("comments_count")
      .eq("artwork_id", artworkId)
      .maybeSingle()

    setBaseComments(
      stats?.comments_count || 0
    )

    // 🔥 FETCH REAL COMMENTS COUNT
    const { count } = await supabase
      .from("comments")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("artwork_id", artworkId)

    setRealCommentsCount(count || 0)

    // NOT LOGGED IN
    if (!userData.user) {
      setComments([])
      return
    }

    // ADMIN SEES ALL COMMENTS
    if (
      userData.user.email ===
      "poiesis.art.gallery.pag@gmail.com"
    ) {

      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("artwork_id", artworkId)
        .order("created_at", {
          ascending: false,
        })

      setComments(data || [])

    } else {

      // USER SEES OWN COMMENTS ONLY
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("artwork_id", artworkId)
        .eq("user_id", userData.user.id)
        .order("created_at", {
          ascending: false,
        })

      setComments(data || [])
    }
  }

  const handleComment = async () => {

    if (!user) {
      alert("Please login first")
      return
    }

    if (!newComment.trim()) return

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          artwork_id: artworkId,
          user_id: user.id,
          comment: newComment,
        },
      ])
      .select()

    if (error) {
      console.error(error)
      return
    }

    setComments((prev) => [
      ...(data || []),
      ...prev,
    ])

    // 🔥 INCREASE REAL COMMENT COUNT
    setRealCommentsCount((p) => p + 1)

    setNewComment("")
  }

  return (

    <div>

      <button
        onClick={() =>
          setShowComments(!showComments)
        }
        className="flex items-center gap-1"
      >

        <MessageCircle size={20} />

        <span className="text-sm">

          {
            baseComments +
            realCommentsCount
          }

        </span>

      </button>

      {showComments && (

        <div className="mt-3">

          <div className="flex gap-2">

            <input
              value={newComment}
              onChange={(e) =>
                setNewComment(e.target.value)
              }
              placeholder="Write a comment..."
              className="
                border p-1 text-sm flex-1
              "
            />

            <button
              onClick={handleComment}
              className="
                text-sm border px-2
              "
            >
              Post
            </button>

          </div>

          <div className="mt-2 text-sm space-y-1">

            {comments.map((c) => (

              <p key={c.id}>

                <strong>

                  {user?.email ===
                  "poiesis.art.gallery.pag@gmail.com"

                    ? "User"

                    : "You"}

                  :

                </strong>{" "}

                {c.comment}

              </p>

            ))}

          </div>

        </div>

      )}

    </div>

  )
}