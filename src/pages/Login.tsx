import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export function Login({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [user, setUser] = useState({ email: "", password: "" })
  const { login } = useAuth()
  
  return (
    <div className={cn("flex flex-col gap-6  w-full", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 ">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Hightex account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}

                  value={user.email}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required
                  onChange={(e) => setUser(prev => ({ ...prev, password: e.target.value }))}
                  value={user.password}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={(user.email == '' || user.password == '')} 
                onClick={async (e) => {
                  e.preventDefault()
                  const res = await login(user)
                  console.log(res)
                  if (!res.error) {
                    
                  }
                }}>Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
