<script>
  import { send, receive } from "./../crossfade.js";
</script>

<style>
  em {
    font-weight: 700;
    font-style: italic;
  }
</style>

<h2 class="heading">ISSUES TO BE AWARE OF</h2>

<div class="text-content">
  <div class="subsection" id="issues_issues1">
    <h3>Mobile and Responsive Design</h3>
    <div class="text-content-block" id="two-setup-methods">
      <h4>Some viewport sizes are not functional</h4>
      <div class="text-sub-block">
        <p>
          Responsive design is
          <em>hard</em>! Especially when you're designing from scratch without a CSS library.
          I've poured a lot of time into this already, but not all viewport
          sizes work well; some may be dysfunctional due to poor placement and
          sizing of elements obscuring gameplay or game controls. This is a
          Work-In-Progress, and I do intend to ensure a solid mobile experience - but it may have to await a complete re-write, which I am planning.
        </p>
        <p>
          <span class="orange bordered">
            This app is optimized for desktop (large landscape-mode screens)!
          </span>
        </p>
      </div>
    </div>
  </div>
</div>
