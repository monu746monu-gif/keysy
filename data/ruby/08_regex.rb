email = "user@example.com"
pattern = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

if email =~ pattern
  puts "Valid email"
end

cleaned = "Keysy 2024".gsub(/\d+/, "YEAR")
puts cleaned
